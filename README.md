# TouchBarGPT

I created this project because I wanted to be as discreetly as possible when cheating in high school, and because I have a MacBook Pro M1 with a TouchBar on it, it gave me this idea for this project.

I know that the project is really not optimised and not really practical but I coded it in only 2 hours and with the techs I know.

This project has been prompted in frensh, but i bet it works well in english too.

## Installation

You must build the project yourself if you want to use it. Be sure that you have nodejs installed by doing `node -v`.

First, clone the project by executing this command :

```sh
git clone https://github.com/Konixy/touchbargpt .
```

Secondly, install all the dependencies by doing `npm i`.

Don't forget to enter your openai api key in `api-key.json` like this :

```json
{
  "apiKey": "Your openai api key"
}
```

Finally, build the project by doing `npm run build`

## Usage

While launching the app, you will be with a touchbar like this :
<img src="doc/touchbar_1.png" />
You can see that you can add context to your prompt like documents and other informations. To add context, simply copy the text with Cmd+C and click the `Add context` button. You will see that the text at the left will update to 1 context.
Next, to set the prompt, simply copy it and click `Set prompt`.
If you want to clear all the contexts and the prompt, you can click `Clear all`

When you are ready with your prompt and context, click the `Ask` button. You will be prompted to choose between a normal response or a short response. If you choose the normal response, it will not ask ChatGPT to be as short as possible but if you choose the short response, it will ask ChatGPT to answer in one sentence only.
<img src="doc/touchbar_2.png" />

## Development

Run a development server by doing `npm run dev`
