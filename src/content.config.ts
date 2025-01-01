import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { parse as parseToml } from 'toml';

const dogs = defineCollection({
  loader: file("src/data/dogs.toml", { parser: (text) => parseToml(text).dogs }),
  schema: {}
})