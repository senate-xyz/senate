use std::{env, thread, time::Duration};

use base64::{
    alphabet,
    engine::{self, general_purpose},
    Engine as _,
};
use metrics::{counter, gauge, histogram};
use metrics_exporter_influx::{InfluxBuilder, MetricData};
use opentelemetry::{
    global,
    sdk::{propagation::TraceContextPropagator, trace, Resource},
    KeyValue,
};
use opentelemetry_otlp::WithExportConfig;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use tonic::metadata::{MetadataMap, MetadataValue};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};
use url::Url;

pub fn setup() {
    let app_name = "discordsecretary";

    let telemetry_key = env::var("TELEMETRY_KEY").expect("$TELEMETRY_KEY is not set");
    let exec_env = env::var("EXEC_ENV").expect("$EXEC_ENV is not set");
    let debug_level = env::var("DEBUG_LEVEL").expect("$DEBUG_LEVEL is not set");

    let (logging_layer, task) = tracing_loki::builder()
        .label("app", app_name)
        .unwrap()
        .label("env", exec_env.clone())
        .unwrap()
        .build_url(
            Url::parse(
                format!(
                    "https://340656:{}@logs-prod-013.grafana.net/",
                    telemetry_key
                )
                .as_str(),
            )
            .unwrap(),
        )
        .unwrap();

    opentelemetry::global::set_text_map_propagator(TraceContextPropagator::new());

    let filter_str = format!("{}={}", app_name, debug_level);
    let env_filter = EnvFilter::try_new(filter_str).unwrap_or_else(|_| EnvFilter::new("info"));

    let mut map = MetadataMap::with_capacity(3);

    let encoded = general_purpose::STANDARD.encode(format!("337169:{}", telemetry_key));

    map.insert(
        "authorization",
        format!("Basic {}", encoded).parse().unwrap(),
    );

    let tracer = opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(
            opentelemetry_otlp::new_exporter()
                .tonic()
                .with_endpoint("https://tempo-prod-08-prod-eu-west-3.grafana.net:443")
                .with_metadata(map),
        )
        .with_trace_config(trace::config().with_resource(Resource::new(vec![
            KeyValue::new("service.name", app_name),
            KeyValue::new("service.env", exec_env.clone()),
        ])))
        .install_batch(opentelemetry::runtime::Tokio)
        .unwrap();

    let telemetry_layer = tracing_opentelemetry::layer().with_tracer(tracer);

    tracing_subscriber::registry()
        .with(env_filter)
        .with(tracing_subscriber::fmt::Layer::default())
        .with(logging_layer)
        .with(telemetry_layer)
        .init();

    tokio::spawn(task);

    thread::sleep(Duration::from_secs(5));

    Box::leak(Box::new(
        InfluxBuilder::new()
            .with_grafana_cloud_api(
                "https://influx-prod-22-prod-eu-west-3.grafana.net/api/v1/push/influx/write",
                Some("683371".to_string()),
                Some(telemetry_key),
            )
            .expect("influx api")
            .with_gzip(false)
            .add_global_tag("app", app_name)
            .add_global_tag("env", exec_env)
            .with_duration(Duration::from_secs(10))
            .install()
            .expect("influx install"),
    ));

    tracing::info!("telemetry set up");
}
