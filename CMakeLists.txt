cmake_minimum_required(VERSION 3.16)
project(MyUWSApp)

set(CMAKE_CXX_STANDARD 17)

find_package(OpenSSL REQUIRED)
find_package(ZLIB REQUIRED)
find_package(Threads REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(LIBUV REQUIRED libuv)

# Manually link libuv
find_library(LIBUV_LIBRARY uv REQUIRED)

# Step 1: Create the executable
add_executable(MyUWSApp src/main.cpp)


include_directories(
  external/uWebSockets/uWebSockets/src
  external/uWebSockets/uWebSockets/deps/llhttp/include
  external/uWebSockets/uWebSockets/deps/abseil-cpp
  external/uWebSockets/uSockets/src
  /usr/local/include
  /usr/local/lib
)

# Step 2: Add the uSockets static library
add_library(uSockets STATIC
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/bsd.c
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/context.c
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/loop.c
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/quic.c
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/socket.c
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/udp.c
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/eventing/libuv.c       # ✅ REQUIRED
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src/internal.c             # ✅ REQUIRED
)


# Step 3: Include headers
target_include_directories(MyUWSApp PRIVATE
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/src            # uWebSockets headers
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src   # uSockets headers
  ${LIBUV_INCLUDE_DIRS}
)

target_include_directories(uSockets PUBLIC
  ${CMAKE_SOURCE_DIR}/external/uWebSockets/uSockets/src
)

# Step 4: Link everything
target_link_libraries(MyUWSApp
  PRIVATE
    uSockets
    ${LIBUV_LIBRARIES}
    OpenSSL::SSL
    OpenSSL::Crypto
    Threads::Threads
    z
    # ZLIB::ZLIB
)
