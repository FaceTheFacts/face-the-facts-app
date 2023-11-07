fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios sync_all_dev

```sh
[bundle exec] fastlane ios sync_all_dev
```

Synchronize all development

### ios sync_all_appstore_certs

```sh
[bundle exec] fastlane ios sync_all_appstore_certs
```

Synchronize all appstore certificates

### ios sync_device_info

```sh
[bundle exec] fastlane ios sync_device_info
```

Register new devices

### ios init_ci

```sh
[bundle exec] fastlane ios init_ci
```

Initialize fastlane and match to work with github actions

### ios beta

```sh
[bundle exec] fastlane ios beta
```



### ios production

```sh
[bundle exec] fastlane ios production
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
