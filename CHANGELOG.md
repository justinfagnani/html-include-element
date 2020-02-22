# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

<!--
   PRs should document their user-visible changes (if any) in the
   Unreleased section, uncommenting the header as necessary.
-->

## Unreleased

<!-- ### Changed -->
<!-- ### Added -->
<!-- ### Removed -->
<!-- ### Fixed -->

## [0.1.2] - 2019-05-01

### Fixed

* Add `<slot>` to project content when using `no-shadow`

### Feature
* Defer firing the `load` event until all `<link>` elements in the shadow root are finished loading.

## [0.1.2] - 2019-04-16

### Fixed
* Handle possible race condition when changing the `src` attribute.

## [0.1.1] - 2019-04-16

### Fixed
* Add repository to package.json

## [0.1.0] - 2019-04-16

### Initial Release
