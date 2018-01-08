# Doujin-bot

This is a Discord bot that allows a user to reverse image search a posted image or find images related to a specific tag. (works best for anime/doujin)

## Installation

To use this bot clone the repository and create your own discord app. Use the token from your app where process.env.BOT_TOKEN is and then run it !

NOTE: I currently have the !play permissions set to an ENV variable. You can choose to do what you want with that. Its set to my userID. May add permissions/roles later.

## Usage

!sauce takes the last image url or attachment posted in that channel and searches it through saucenao.com's api.  !find <tag_name> uses gelbooru to return an image related to the tag name.  !play sets the Playing: status !help returns basically this !

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

v1(?)

## Credits

Flo, Riker, saucenao(image api), gelbooru(tag api), Diego Perini(URL regex)

## License

TODO: Write license
