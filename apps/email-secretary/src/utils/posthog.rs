use std::env;

pub fn posthog_bulletin_event(event: &str, user: String, r#type: &str, message_id: &str) {
    let mut event = posthog_rs::Event::new(event, user.as_str());
    event.insert_prop("type", message_id).unwrap();
    event.insert_prop("messageid", r#type).unwrap();

    event.insert_prop("$lib", "email-secretary").unwrap();
    event.insert_prop("$geoip_disable", true).unwrap();

    let _ = posthog_rs::client(
        env::var("NEXT_PUBLIC_POSTHOG_KEY")
            .expect("$NEXT_PUBLIC_POSTHOG_KEY is not set")
            .as_str(),
    )
    .capture(event);
}

pub fn posthog_quorum_event(
    event: &str,
    user: String,
    r#type: &str,
    proposal_name: String,
    dao_name: String,
    message_id: &str,
) {
    let mut event = posthog_rs::Event::new(event, user.as_str());
    event.insert_prop("type", r#type).unwrap();
    event.insert_prop("messageid", message_id).unwrap();
    event.insert_prop("proposal", proposal_name).unwrap();
    event.insert_prop("dao", dao_name).unwrap();

    event.insert_prop("$lib", "email-secretary").unwrap();
    event.insert_prop("$geoip_disable", true).unwrap();

    let _ = posthog_rs::client(
        env::var("NEXT_PUBLIC_POSTHOG_KEY")
            .expect("$NEXT_PUBLIC_POSTHOG_KEY is not set")
            .as_str(),
    )
    .capture(event);
}
