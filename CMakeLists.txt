cmake_minimum_required(VERSION 3.16)
project(MyUWSApp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
set(CMAKE_OSX_DEPLOYMENT_TARGET "15.0")

# Find packages
find_package(OpenSSL REQUIRED)
find_package(ZLIB REQUIRED)
find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBUV REQUIRED libuv)

# Fallback: Also try to locate libuv directly if needed
find_library(LIBUV_LIBRARY uv REQUIRED)

# Add your executable source
add_executable(MyUWSApp src/main.cpp)


# Include headers
include_directories(
  external   # 👈 this is key
  external/uWebSockets/src
  external/uWebSockets/src/crypto
  external/uWebSockets/deps/abseil-cpp
  external/uWebSockets/deps/llhttp/include
  external/uWebSockets/uSockets/src
  ${OPENSSL_INCLUDE_DIR}
  ${ZLIB_INCLUDE_DIRS}
  ${LIBUV_INCLUDE_DIRS}
)

# Add uSockets static library
add_library(uSockets STATIC
  external/uWebSockets/uSockets/src/bsd.c
  external/uWebSockets/uSockets/src/context.c
#   external/uWebSockets/uSockets/src/internal.c Does not exist anymore in uWebsocket
  external/uWebSockets/uSockets/src/loop.c
#   external/uWebSockets/uSockets/src/quic.c
  external/uWebSockets/uSockets/src/socket.c
  external/uWebSockets/uSockets/src/udp.c
  external/uWebSockets/uSockets/src/eventing/libuv.c # ✅ Required for libuv backend

  # SSL internals (required for SSL support)
  external/uWebSockets/uSockets/src/crypto/openssl.c
  external/uWebSockets/uSockets/src/crypto/sni_tree.cpp
)

target_compile_definitions(uSockets PRIVATE LIBUS_USE_OPENSSL LIBUS_USE_LIBUV OPENSSL_SUPPRESS_DEPRECATED)

target_include_directories(uSockets PUBLIC
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/crypto

)

# Link everything together
target_link_libraries(MyUWSApp
  PRIVATE
    uSockets
    ${LIBUV_LIBRARY}
    ${OPENSSL_LIBRARIES}
    Threads::Threads
    ZLIB::ZLIB
)

