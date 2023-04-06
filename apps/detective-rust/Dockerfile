ARG DETECTIVE_URL
ARG DATABASE_URL
ARG ALCHEMY_NODE_URL

FROM lukemathwalker/cargo-chef:latest AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder 
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo prisma generate && cargo build --release --bin detective-rust

FROM debian:bullseye-slim AS runtime
RUN apt update
RUN apt install openssl ca-certificates -y
WORKDIR /app
COPY --from=builder /app/target/release/detective-rust /usr/local/bin
ENTRYPOINT ["/usr/local/bin/detective-rust"]

EXPOSE $PORT