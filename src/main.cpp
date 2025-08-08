#include <App.h>
#include <iostream>

int main() {
    uWS::App().listen(9001, [](auto *listen_socket) {
        if (listen_socket) {
            std::cout << "Listening on port 9001\n";
        }
    }).run();

    std::cout << "Server exited\n";
    return 0;
}