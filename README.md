# EasyFilter

🎈 Welcome to **EasyFilter**! 👋

EasyFilter is a lightweight ☁️, just one dependency 🚢, minimal setup 😮, intuitive 😃 and powerful 💪 filter for all your filter needs.

It's as easy as this:
```js
  const filter = EasyFilter(sourceArray)
  const filteredResult = filter.search('your query')
```

The one dependency is [EasyFilterParser](https://www.npmjs.com/package/@noriller/easy-filter-parser) that was part of this package before. 😉
## Get Started

### Use your choice of package manager

```bash
npm install @noriller/easy-filter
```

```bash
yarn add @noriller/easy-filter
```

### Then import it with the syntax of your choice

```js
import EasyFilter from '@noriller/easy-filter'
```

```js
const EasyFilter = require('@noriller/easy-filter')
```

### Finally, to actually use it

```js
  const filter = EasyFilter(sourceArray)
  const filteredResult = filter.search('your query')
```

That's it! 🧙‍♂️

Check out the section [EasyFilter Operators](#easyfilter-operators) to see all that you can pass to the filter, the real ✨magic✨ is there!

```js
✨ Magic like turning this:
  `search for something "this between quotes" and then here:"you search for this"`
✨
  Into something that works for single values, quoted values and even values nested inside keys. AND MORE!
✨
```

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

The trade off is clear: we give you a powerful engine that will return the data following what you're searched for, but it comes at a cost. 

For your everyday use, you're probably fine and your users will love it. 😎

(As a side note, I would love to know how EasyFilter fare against any other solution you might try. ❤😍❤)

## EasyFilter Operators

Most of this should be intuitive for most users... that's what I was aiming for after all. 🧐
### OR query

Any word or operators are, primarily and lastly, treated as `OR` queries.

To be a match, the data needs only to match any of them to be returned.

#### OR Example:
```js
filter.search('word1 word2 tag:value "quoted value"')
```
`word1`, `word2`, `tag:value` and `"quoted value"` each become separated entities and a match of any one of those will return.

### AND query

Anything inside quotes (either double `"` or single `'`) will be treated as one entity.

EasyFilter relies heavily on recursion and this one entity will be split into multiple entities, following those entities rules.

To be a match, the data must get a match from each subquery inside quotes.

#### AND Remarks

An `AND` query can contain: `OR`, `TAG` and even nested `AND` queries.

In case of nested `TAG` and `AND` queries, the nested quote must not match the parent quote.

#### AND Example:
```js
filter.search('"quoted value tag:value"')
```
`quoted`, `value` and `tag:value` first are an `AND` query and will match only if all of the subqueries match.

In this case, both `quoted` and `value` become `OR` queries and `tag:value` becomes `TAG` query.

### TAG query

TAG here is equivalent to any `key` of a Javascript object.

`TAG`, like `AND` queries, return subqueries where they target a slice of the object, namely the `key`.

To be a match, the data must get a match from the subquery after the `TAG`.

#### TAG Remarks

A `TAG` query can contain: `OR`, `AND` and then `NULL` and `RANGE`/`DATE_RANGE` queries.

`TAG` doesn't support nested `TAG` queries. (As of now.)

#### Types of TAG queries with Examples:
##### TAG - Simple
```js
filter.search('tag:value')
```
Just the `TAG` followed by a colon and the `value`.

`value` in this example will become an `OR` query.

##### TAG - OR
```js
filter.search('tag:(value1 value2 value3)')
```
By using brackets, you can have an `OR` query with multiple values at once.

##### TAG - AND
```js
filter.search('tag:"value1 value2 value3"')
```
By using quotes (single/double), you can have an `AND` query.

##### TAG - Null Values
```js
filter.search('tag:null tag:nil tag:none tag:nothing')
```
By passing, alone, any of the words: `NULL`, `NIL`, `NONE` or `NOTHING` as the value of the `TAG`, it will match only if the `key` doesn't exist in the object (or if the key is `null` or `undefined`).

`tag:(nothing)`, in contrast, will match only if the `key` contains the string "nothing".

##### TAG - Chaining Tags
```js
filter.search('tag.subTag.thirdTag:value')
```
You can chain tags together using a `.` (full stop/period).

This would be equivalent to nested `TAGs`. (Nested tags aren't supported.)

##### TAG - Arrays
```js
filter.search('tag.0:value tag2.*.subTag:value')
```
While the most common use case for EasyFilter would be, indeed, common objects (think JSON Objects with key/value pairs), arrays are supported.

The main difference is that the `key` they use are numerical and ordered.

`tag.0:value` will search inside the "tag" key, then in the element "0" for the "value".

`tag2.*.subTag:value` will search inside the "tag2" key, then in ALL elements for the "subTag" and then for the "value".

So, if the position in the array matters, use the index. Otherwise, use `*` (asterisk) to search all elements in the array.

##### TAG - RANGE
```js
filter.search('tag:range(0,5)')
```
By passing, alone, the operator `RANGE()` you can pass one or two arguments that will filter based on the numbers.

`RANGE` can only be used inside `TAG` and with `number` values.

The first argument is the lower bound (`-Infinity`) and the second argument is the upper bound (`Infinity`).

Passing only one argument sets only the lower bound. To set only the upper bound, pass it empty: `RANGE(,5)`.

##### TAG - DATE_RANGE
```js
filter.search('tag:dateRange(2020-05-01, 2021-09-05)')
```
By passing, alone, the operator `DATERANGE()` you can pass one or two arguments that will filter based on the dates.

`DATERANGE` can only be used inside `TAG` and with `date` values.

The first argument is the lower bound (`0000-01-01`) and the second argument is the upper bound (`9999-01-01`).

Passing only one argument sets only the lower bound. To set only the upper bound, pass it empty: `DATERANGE(,2021-09-05)`.

More on accepted `Date Formats` in [Date Format (Query)](#dateformat-query), but you can use all the common formats like `DD/MM/YYYY`, `MM/DD/YYYY` and `YYYY/MM/DD` as long as you pass it as an `OPTION`. If no `Date Format` is provided, the Javascript default implementation of `new Date('your date string')` will be used.

### NOT query

By nesting any and multiple queries inside the syntax `NOT()` you can invert those and it will NOT return anything that matches.

If there's a match in the `NOT` query, it won't return even if there's a match in other queries.

If your query contains only `NOT` queries, it will return everything that don't have a match.

When combining with other queries, `NOT` queries will filter out matches from those.

#### NOT Remarks

A `NOT` query can contain: `OR`, `AND` and `TAG` queries.

All `NOT` are parsed at the same level, nesting it inside other queries will just remove them from the query.

#### NOT Example:
```js
filter.search('not("quoted value tag:value")')
```
Any element with `quoted`, `value` and `tag:value` will not be returned.

### EasyFilter Options

There's three types of options:
* Those that can be passed any time:
  * [Normalize](#normalize)
  * [Indexing](#indexing)
  * [Limit](#limit)
* Those that can only be passed in the setup:
  * [Filter Options](#filter-options)
    * [Date Format (Setup)](#dateformat-setup)
  * [Tag Aliases](#tag-aliases)
* Those that can only be passed with the query:
  * [Date Format (Query)](#dateformat-query)
#### OPTION keyword

Using the syntax `OPTION()` or `OPTIONS()` you can pass the following options inside your search string.

The `OPTION` keyword is parsed first, it will be just removed if nested in other queries and anything else inside will be either parsed as an option or ignored.

##### DATEFORMAT (Query)

When passed as an `OPTION`, `DateFormat` will be used to parse the dates used in [`DATE_RANGE`](#tag---date_range).

This way your users can use their locale date format in their query.

When using `DATE_RANGE`, if no `DateFormat` is passed as an option the Javascript default implementation of `new Date('your date string')` will be used.

The formats can be: `YYYY-MM-DD`, `DD-MM-YYYY` and `MM-DD-YYYY` while the separators can be: `-`, `.`, `,` and `/`.

###### DateFormat Example
```js
filter.search('tag:dateRange(30-12-2020,30-12-2022) option(dateFormat:DD.MM.YYYY)')
```

##### NORMALIZE

When the `NORMALIZE` option is used, `EasyFilter` will discard/ignore every and all diacritics when making comparisons. It's FALSE by default.

This means that with `NORMALIZE`: `Crème brûlée` is equal to `Creme brulee`.

`EasyFilter` uses the [`string.normalize('NFD')`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) javascript API to decompose the strings and then remove all [Combining Diacritical Marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).

`NORMALIZE` uses a `boolean` flag, and when used in `OPTIONS` alone like `option(normalize)` it will assume the TRUE value, but you can explicitly use: `normalize:true`.

You can also use `normalize:false` to disable a [setup default](#filter-options) normalization for a specific query.

##### INDEXING

When the `INDEXING` option is used, `EasyFilter` will use a numerical ranking system and if there's a match, it will return a copy of the element with an additional key `_EasyFilterIndex` that will have a "relevance score" that you can use to sort the results. It's FALSE by default.

`INDEXING` uses a `boolean` flag, and when used in `OPTIONS` alone like `option(index)` or `option(indexing)` it will assume the TRUE value, but you can explicitly use: `index:true`.

You can also use `normalize:false` to disable a [setup default](#filter-options) indexing for a specific query.

###### How it indexing works in EasyFilter

`EasyFilter` gives a number based on the types of queries and multiplies the results returned by nested queries.
* OR = 1
* AND = 3
* TAG = 5
* RANGE/DATE_RANGE/NULL = 10

This way, using more generic queries, those with the more specific parameters will have a higher indexing value.

##### LIMIT

When the `LIMIT` option is used, `EasyFilter` will return only the `LIMIT` number of results. It's Zero/FALSE by default.

`LIMIT` needs a `number` value, when used in `OPTIONS` you need to also pass a `number` value: `option(limit:1)`.

You can also use `limit:0` to disable a [setup default](#filter-options) limit for a specific query.
#### Setup Options

In the setup you may pass:
##### Filter Options

The following options works the same way as if passing in the query:
  * [Normalize](#normalize)
  * [Indexing](#indexing)
  * [Limit](#limit)

By passing it in the setup, they will be used in every `search`.

###### DATEFORMAT (Setup)

When passed in the `Setup`, `DateFormat` will be used to parse the dates in your `Source Array`.

If no `DateFormat` is passed in the `setup`, the Javascript default implementation of `new Date('your date string')` will be used.

If that default implementation wouldn't work with your `source array`, then provide a `DateFormat`.

The formats can be: `YYYY-MM-DD`, `DD-MM-YYYY` and `MM-DD-YYYY` while the separators can be: `-`, `.`, `,` and `/` (you can use the provided typing).

##### Tag Aliases

Pass `TAG Aliases` in the setup to expose to users more friendly (or broader) terms that they can call your data using `TAG`.

`Tag Aliases` should be a dictionary with `key`/`value` pairs where the `key` is what your users can use and the `value` is a array of strings that will refer to your actual data.

Our `data sources` might not always be the most user friendly, or something important might be nested where users `Tag Aliases` couldn't possibly know. This is where you use `Tag Aliases`.

###### Aliases Examples

```js
const filter = EasyFilter(sourceArray, {
    tagAliases: {
      // if you want more friendly aliases
      data: ['DT_0001X420'],
      name: ['nm_first', 'nm_last'],
      // if the important data is nested
      age: ['person.info.age'],
      // if your users expect to find everything related to a word
      address: ['address', 'city', 'country', 'province', 'zip_code'],
      // and you have no idea which words they will search for
      // just create multiple aliases with the same tags
      city: ['address', 'city', 'country', 'province', 'zip_code'],
      country: ['address', 'city', 'country', 'province', 'zip_code'],
      province: ['address', 'city', 'country', 'province', 'zip_code'],
      zip: ['address', 'city', 'country', 'province', 'zip_code'],
      location: ['address', 'city', 'country', 'province', 'zip_code'],
      where: ['address', 'city', 'country', 'province', 'zip_code'],
      position: ['address', 'city', 'country', 'province', 'zip_code'],
    }
  })
```

## What's next?

Here's something you can expect in the future:

* New objective: `EasyFilter` will now become a trilogy! They will all share the same parser, so you will be able to filter values already buffered and values in your databases all the same, simple way.
  * This, which filter values in objects.
  * `EasyFilter-SQL` - That will create SQL queries.
  * `EasyFilter-Mongo` - That will create Mongo queries.
* (TBD) Streams support ⚡: be it from an API or from a data source, data usually comes as a stream. If the Javascript Engine can handle streaming fine, why wait for it to buffer everything?

## There's a problem or it could be better

Either if you're encountered a problem: 😢 or if you're have an idea to make it better: 🤩

Feel free to contribute, to open issues, bug reports or just to say hello! 🤜🤛


In case of bugs or errors, if possible, send an example of your data, of the query you're using and what you've expected.

Since it supports any kind of data or queries... who knows what can happen?

I do have one remark to say: It will probably err on the side of caution... maybe returning more than you might have expected and when using the negation query, filtering more than intended, so keep that in mind.

## Work with me!

https://www.linkedin.com/in/noriller/

### Hit me up at Discord!

https://discord.gg/XtNPk7HeCa
### Or Donate:

* [$5 Nice job! Keep it up.](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=5)
* [$10 I really liked that, thank you!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=10)
* [$42 This is exactly what I was looking for.](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=42)
* [$1K WOW. Did not know javascript could do that!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=1000)
* [$5K I need something done ASAP! Can you do it for yesterday?](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=5000)
* [$10K Please consider this: quit your job and work with me!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD&amount=10000)
* [$??? Shut up and take my money!](https://www.paypal.com/donate/?business=VWNG7KZD9SS4S&no_recurring=0&currency_code=USD)

## That’s it! 👏