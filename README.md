# QuantConnect File Sync

## Usage

```
QuantConnect FileSync v0.0.1

Usage: quantconnect-filesync [options] [command]

Options:
  -v, --version       output the version number
  -h, --help          output usage information

Commands:
  projects [options]  List projects from QuantConnect
  download [options]  Download all files from QuantConnect to the current directory
  upload [options]    Upload all files from current directory to QuantConnect
  watch [options]     Watch for file updates in the current directory and sync changes to QuantConnect
```

## Configuration

All commands accept a `--user` option to provide the QuantConnect user ID and a `--token` option to provide the
QuantConnect API token. However, `quantconnect-filesync` will also look in the ENV for `QUANTCONNECT_USER_ID` and
`QUANTCONNECT_TOKEN` and use these automatically if present. You can set these in your local environment manually or
optionally create a `.env` file with these values set:

```
# .env
QUANTCONNECT_USER_ID=12345
QUANTCONNECT_TOKEN=ABCDEF
```

For project-specific commands, `quantconnect-filesync` will additionally accept a `--project` option to provide the
QuantConnect project ID. This option also has a corresponding `QUANTCONNECT_PROJECT_ID` ENV variable that can be set in
project-specific `.env` files.

## Examples

### Projects

```bash
$ quantconnect-filesync projects -u 12345 -t ABCDEF
QuantConnect FileSync v0.0.1

Listing all projects from QuantConnect…

1234567: Library / Alphas / RSI Alpha
8901234: Library / Alphas / Supertrend Alpha
5678901: Library / Indicators / AroonOscillator
2345678: Library / Indicators / AverageTrueRange
9012345: Strategies / Profit Strategy
```

### Project Details

```bash
$ quantconnect-filesync project -u 12345 -t ABCDEF -p 9012345
QuantConnect FileSync v0.0.1

Listing project 9012345 from QuantConnect…

Name: Strategies / Profit Strategy
Description: My profitable strategy
Project ID: 9012345
Created: 2019-03-02 16:18:45
Last modified: 2020-01-13 05:22:43
Owner ID: 12345
Language: C#
```

### Download

```bash
$ quantconnect-filesync download -u 12345 -t ABCDEF -p 9012345
QuantConnect FileSync v0.0.1

Downloading files for project 9012345 from QuantConnect…

Strategies / Profit Strategy:
 - main.cs ✔
 - MyIndicator.cs ✔
 - MyAlpha.cs ✔
```

### Upload

```bash
$ quantconnect-filesync upload -u 12345 -t ABCDEF -p 9012345
QuantConnect FileSync v0.0.1

Uploading files for project 9012345 to QuantConnect…

Strategies / Profit Strategy:
 - main.cs ✔
 - MyIndicator.cs ✔
 - MyAlpha.cs ✔
```

### Watch

```bash
$ quantconnect-filesync watch -u 12345 -t ABCDEF -p 9012345
QuantConnect FileSync v0.0.1

Downloading files for project 9012345 from QuantConnect…

Strategies / Profit Strategy:
 - main.cs ✔
 - MyIndicator.cs ✔
 - MyAlpha.cs ✔

Watching for local changes to project 9012345…

ADD Strategies / DevTrader Strategy / strategy.cs ✔
CHANGE Strategies / DevTrader Strategy / strategy.cs ✔
CHANGE Strategies / DevTrader Strategy / MyAlpha.cs ✔
CHANGE Strategies / DevTrader Strategy / MyIndicator.cs ✔
CHANGE Strategies / DevTrader Strategy / MyIndicator.cs ✔
DELETE Strategies / DevTrader Strategy / MyAlpha.cs ✔
```
