use std::env;

pub fn posthog_event(event: &str, user: String, proposal_name: String, dao_name: String) {
    let mut event = posthog_rs::Event::new(event, user.as_str());
    event.insert_prop("proposal", proposal_name).unwrap();
    event.insert_prop("dao", dao_name).unwrap();
    event.insert_prop("app", "slack-secretary").unwrap();

    let _ = posthog_rs::client(
        env::var("NEXT_PUBLIC_POSTHOG_KEY")
            .expect("$NEXT_PUBLIC_POSTHOG_KEY is not set")
            .as_str(),
    )
    .capture(event);
}
