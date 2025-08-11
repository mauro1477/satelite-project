cmake_minimum_required(VERSION 3.16)
project(MyUWSApp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
set(CMAKE_OSX_DEPLOYMENT_TARGET "15.0") # Target newer macOS 


set(OPENSSL_ROOT_DIR "/usr/local/opt/openssl@3") # or /opt/homebrew/opt/openssl@3
set(OPENSSL_INCLUDE_DIR "${OPENSSL_ROOT_DIR}/include")
set(OPENSSL_CRYPTO_LIBRARY "${OPENSSL_ROOT_DIR}/lib/libcrypto.dylib")
set(OPENSSL_SSL_LIBRARY "${OPENSSL_ROOT_DIR}/lib/libssl.dylib")

find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBUV REQUIRED libuv)

# Find packages
find_package(OpenSSL REQUIRED)
find_package(ZLIB REQUIRED)
find_package(Threads REQUIRED)
find_library(LIBUV_LIBRARY uv REQUIRED)

# Add your executable source
add_executable(MyUWSApp src/main.cpp)

# Add uSockets static library
add_library(uSockets STATIC
  external/uWebSockets/uSockets/src/bsd.c
  external/uWebSockets/uSockets/src/context.c
  external/uWebSockets/uSockets/src/loop.c
  external/uWebSockets/uSockets/src/socket.c
  external/uWebSockets/uSockets/src/udp.c
  external/uWebSockets/uSockets/src/eventing/libuv.c 
  external/uWebSockets/uSockets/src/crypto/openssl.c
  external/uWebSockets/uSockets/src/crypto/sni_tree.cpp
)

target_compile_definitions(uSockets PRIVATE
  LIBUS_USE_OPENSSL 
  LIBUS_USE_LIBUV 
  OPENSSL_SUPPRESS_DEPRECATED
)

target_include_directories(uSockets PUBLIC
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/crypto
  ${OPENSSL_INCLUDE_DIR}
)

target_include_directories(MyUWSApp PRIVATE
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/src
  external/json
  ${OPENSSL_INCLUDE_DIR}
  ${ZLIB_INCLUDE_DIRS}
)

# 5) Link AFTER the target exists
# Prefer imported targets if available; fall back to raw libs on Amazon Linux
if (TARGET OpenSSL::SSL)
  target_link_libraries(MyUWSApp PRIVATE
    uSockets
    ${LIBUV_LIBRARIES}
    OpenSSL::SSL 
    OpenSSL::Crypto
    Threads::Threads
    ZLIB::ZLIB
  )
else()
  find_library(OPENSSL_SSL_LIBRARY NAMES ssl REQUIRED PATHS /usr/lib64 /usr/lib)
  find_library(OPENSSL_CRYPTO_LIBRARY NAMES crypto REQUIRED PATHS /usr/lib64 /usr/lib)
  target_link_libraries(MyUWSApp PRIVATE
    uSockets
    ${LIBUV_LIBRARIES}
    ${OPENSSL_SSL_LIBRARY} 
    ${OPENSSL_CRYPTO_LIBRARY}
    Threads::Threads
    ZLIB::ZLIB
  )
endif()