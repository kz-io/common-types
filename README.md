<p align="center">
<img alt="kz logo" height="64" src="https://raw.githubusercontent.com/i11n/.github/main/svg/kz/color/kz.svg" />
<strong>common-types</strong>
</p>

<p align="center">
kz is a library providing heavily tested and documented features with
consistent and predictable APIs designed to simplify the development and
maintenance of complex, performant, and scalable
<a href="https://deno.com">Deno</a> applications.
</p>

<h1 align="center">@kz/common-types</h1>

<p align="center">
The <code>@kz/common-types</code> module provides base type aliases, interfaces, and enums
for the core modules and others commonly used across kz libraries and in
general development.
</p>

<p align="center">
<a href="https://jsr.io/@kz/common-types">Overview</a> |
<a href="https://jsr.io/@kz/common-types/doc">API Docs</a>
</p>

```tsx
import type { IHelpful, Scalar } from './mod.ts';

const help: IHelpful = {
  helpUrl: 'https://example.com',
};

const pathId: Scalar = help.helpUrl;
```

Why are enums here?

Enums, as integereleven uses them, only have numeric values. Because of this,
we can generally get away with using the enum only as a type and provide a
matching number without referencing the enum itself.

We use the enums more as type documentation for developers.

```tsx
import { assertEquals } from '@std/assert';
import type { ComparisonResult } from './mod.ts';

function compare(a: number, b: number): ComparisonResult {
  if (a === b) return 0;

  return a > b ? 1 : -1;
}

const result = compare(10, 9); // ComparisonResult.Greater

assertEquals(result, 1);
```

## Contributing

Contributions are welcome! Take a look at our [contributing guidelines][contributing] to get started.

<p align="center">
<a href="https://github.com/i11n/.github/blob/main/.github/CODE_OF_CONDUCT.md">
  <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=flat-square" />
</a>
</p>

## License

The MIT License (MIT) 2022 integereleven. Refer to [LICENSE][license] for details.

<p align="center">
<sub>Built with ❤ by integereleven</sub>
</p>

<p align="center">
<img
  alt="kz.io logo"
  height="64"
  src="https://raw.githubusercontent.com/i11n/.github/main/svg/brand/color/open-stroke.svg"
/>
</p>

<p align="center">
<a href="https://github.com/kz-io/common-types/commits">
  <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/kz-io/common-types?style=flat-square">
</a>
<a href="https://github.com/kz-io/common-types/issues">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues-raw/kz-io/common-types?style=flat-square">
</a>
</p>

<p align="center">
<a href="https://jsr.io/@kz/common-types">
  <img src="https://jsr.io/badges/@kz/common-types" alt="" />
</a>
<a href="https://jsr.io/@kz/common-types">
  <img src="https://jsr.io/badges/@kz/common-types/score" alt="" />
</a>
</p>

[deno]: https://deno.dom "Deno homepage"
[jsr]: https://jsr.io "JSR homepage"
[branches]: https://github.com/kz-io/common-types/branches "@kz/common-types branches on GitHub"
[releases]: https://github.com/kz-io/common-types/releases "@kz/common-types releases on GitHub"
[contributing]: https://github.com/kz-io/common-types/blob/main/CONTRIBUTING.md "@kz/common-types contributing guidelines"
[license]: https://github.com/kz-io/common-types/blob/main/LICENSE "@kz/common-types license"
