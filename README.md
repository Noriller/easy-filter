# EasyFilter

🎈 Welcome to **EasyFilter**! 👋

EasyFilter is a lightweight ☁️, zero dependencies 🚢, minimal setup 😮, intuitive 😃 and powerful 💪 filter for all your filter needs.

It's as easy as this:
```js
  const filter = EasyFilter(sourceArray)
  const filteredResult = filter.search('your query')
```

## Get Started

### **As of 2021-09-04 the package is still not available, please wait patiently**

### Use your choice of package manager

`npm install EasyFilter`

`yarn install EasyFilter`

### Then import it with the syntax of your choice

```js
import EasyFilter from 'EasyFilter'
```

```js
const EasyFilter = require('EasyFilter')
```

### **As of 2021-09-04 the package is still not available, please wait patiently**

### Finally, to actually use it

```js
  const filter = EasyFilter(sourceArray)
  const filteredResult = filter.search('your query')
```

That's it! 🧙‍♂️

Check out the section [EasyFilter Operators](#easyfilter-operators) to see all that you can pass to the filter, the real ✨magic✨ is there!

#### Really? That's it?

Ok. If you need more options, here's the full setup you can do using all options available:

```js
const filter = EasyFilter(sourceArray, {
    filterOptions: {
      dateFormat: 'DD-MM-YYYY',
      normalize: true,
      indexing: true,
      limit: 10,
    },
    tagAliases: {
      tag: ['tag1', 'tag2', 'tag3'],
    }
  })

const filteredResult = filter.search('your query')
```

It's still that simple. 👨‍💻

All the options will be explained in [EasyFilter Options](#easyfilter-options).
And most of them you can pass in the `search` 🔎 string when you need.

## Inspirations and motivation

In corporate scenarios, sometimes we have too much information 😵. We make pages with endless columns and if we need to filter that data, we either use something generic like `Object.keys(object).join(' ').includes('string')` or we have to make a custom search... for. each. table. 😫

Meanwhile I saw awesome (and probably custom solutions) in things we use everyday.

Check out the ones I was aiming for 🌟:
* Github
* Stackoverflow
* Gmail/Google Search

In the latter, users can use their UI to create their queries while powerusers can just type that and much more.

I too needed to provide a way to users to filter the data and ended up settling at a simpler version of this project. Mostly because of all the solutions I was able to find were neither user or developer friendly. 😢

(Also a little rant: `search`, `filter`, `matcher` and the like are a nightmare to search for... too many hits and too little relevant results 😕)

This is what I'm trying to offer here: a powerful engine to make your queries. 😎👍

Then it's up to you to offer a UI for what makes sense for your data. And it's still intuitive for common users and powerful for powerusers.

## Why should you use

Unless searching and filtering data IS your business... each table, each data source you need to filter based on any criteria could be another source of frustration. 👨‍🏭

While sometimes this can be easy as `dataSource.filter(x => x.attribute === 'something')`, usually it's more complicated than that.

And when you have to factor what the users might want at any given time, it can become a nightmare. 😫

And if you're seeing yourself here... then you probably should use it.

## When should you use, or better yet, when you shouldn't use?

* If something like `Object.keys(object).join(' ').includes('string')` or `dataSource.filter(x => x.attribute === 'something')` is enough for your need, you probably wouldn't want to bother using it.

* EasyFilter is not a fuzzy filter (at least not yet, who knows? 🤔), so if you're expecting clumsy typers searching your data... they might have a hard time.

* EasyFilter also don't care about upper or lowercase and/or ordering of the words in your queries (again: at least not yet), so if that's important... I'm sorry? 🙇‍♂️

* This one is a little relative: if you need maximum performance... well, test it out if it work for you! The more options you use and the more your data objects branches out on objects upon objects... the more time it needs to traverse everything. (And even then, I believe you can use it for prototyping and/or as a crutch while you make your own custom filter. Don't worry, I understand. 😉)

The trade off is clear: we give you a powerful engine that will return the data following what you're searched for, but if comes at a cost. For your everyday use, you're probably fine and your users will love it. 😎

(As a side note, I would love to know how EasyFilter fare against any other solution you might try. ❤😍❤)

## EasyFilter Operators




## What's next?

Here's something you can expect in the future:

* Streams support ⚡: be it from an API or from a data source, data usually comes as a stream. If the Javascript Engine can handle streaming fine, why wait for it to buffer everything?

## There's a problem or it could be better

Either if you're encountered a problem: 😢 or if you're have an idea to make it better: 🤩

Feel free to contribute, to open issues, bug reports or just to say hello! 🤜🤛


In case of bugs or errors, if possible, send an example of your data, of the query you're using and what you've expected.

Since it supports any kind of data or queries... who knows what can happen?

I do have one remark to say: It will probably err on the side of caution... maybe returning more than you might have expected and when using the negation query, filtering more than intended, so keep that in mind.

## The masterminds behind EasyFilter (AKA Contributors)


## That’s it! 👏