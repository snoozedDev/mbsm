{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_20
            pkgs.bun
            pkgs.docker
          ];

          RUSTFLAGS="-C linker=lld";

          shellHook = ''
            # run docker in the background
            docker compose --env-file .env -f _infrastructure/docker-compose.yml up -d
            # stop docker when exiting the shell
            trap "docker compose --env-file .env -f _infrastructure/docker-compose.yml down" EXIT
          '';
        };
      });
}