#include <App.h>
#include <chrono>
#include <thread>
#include <random>
#include <json.hpp>  // JSON library: https://github.com/nlohmann/json
#include <iostream>
using json = nlohmann::json;

struct PerSocketData {};

static std::string generateTelemetry() {
    static std::default_random_engine eng{std::random_device{}()};
    static std::uniform_real_distribution<double> r01(0.0, 1.0);

    json j = {
        {"timestamp", std::chrono::duration_cast<std::chrono::milliseconds>(
                          std::chrono::system_clock::now().time_since_epoch()).count()},
        {"altitude_km", 400.0 + r01(eng) * 10.0},
        {"velocity_kms", 7.66 + r01(eng) * 0.1},
        {"battery_voltage", 3.7 + r01(eng) * 0.1},
        {"temperature_c", -10.0 + r01(eng) * 5.0},
        {"orientation", {{"x", r01(eng)}, {"y", r01(eng)}, {"z", r01(eng)}, {"w", r01(eng)}}}
    };
    return j.dump();
}

int main() {
    uWS::App app;

    app.ws<PerSocketData>("/*", {
        .open = [](auto* ws) {
            ws->subscribe("telemetry");                     // <-- subscribe client
            std::cout << "Client connected & subscribed\n";
        },
        .close = [](auto* /*ws*/, int /*code*/, std::string_view /*msg*/) {
            std::cout << "Client disconnected\n";
        }
    });

    // Bind both stacks so the browser can reach it
    app.listen("0.0.0.0", 3001, [](auto* t){ if (t) std::cout << "Listening IPv4 :3001\n"; });
    app.listen("::",       3001, [](auto* t){ if (t) std::cout << "Listening IPv6 :3001\n"; });

    // Grab the loop *after* building the app and before run()
    uWS::Loop* loop = uWS::Loop::get();
    // Start a background producer thread
    std::thread producer([loop, &app](){
        while (true) {
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
            std::string payload = generateTelemetry();

            // Hop back to uWS loop thread to publish safely
            loop->defer([&app, payload = std::move(payload)]() mutable {
                app.publish("telemetry", payload, uWS::OpCode::TEXT, /*compress*/ false);
            });
        }
    });
    producer.detach();

    app.run();
    return 0;
}