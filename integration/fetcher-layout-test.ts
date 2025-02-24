import { createAppFixture, createFixture, js } from "./helpers/create-fixture";
import type { Fixture, AppFixture } from "./helpers/create-fixture";

let fixture: Fixture;
let app: AppFixture;

beforeAll(async () => {
  fixture = await createFixture({
    files: {
      "app/routes/layout-action.jsx": js`
        import { json } from "@remix-run/node";
        import { Outlet, useFetcher, useFormAction } from "@remix-run/react";

        export let action = ({ params }) => json("layout action data");

        export default function ActionLayout() {
          let fetcher = useFetcher();
          let action = useFormAction();

          let invokeFetcher = () => {
            fetcher.submit({}, { method: "post", action });
          };

          return (
            <div>
              <h1>Layout</h1>
              <button onClick={invokeFetcher}>Invoke Fetcher</button>
              {!!fetcher.data && <p id="layout-fetcher-data">{fetcher.data}</p>}
              <Outlet />
            </div>
          );
        }
      `,

      "app/routes/layout-action/index.jsx": js`
        import { json } from "@remix-run/node";
        import {
          useFetcher,
          useFormAction,
          useLoaderData,
        } from "@remix-run/react";

        export let loader = ({ params }) => json("index data");

        export let action = ({ params }) => json("index action data");

        export default function ActionLayoutIndex() {
          let data = useLoaderData();
          let fetcher = useFetcher();
          let action = useFormAction();
          
          let invokeFetcher = () => {
            fetcher.submit({}, { method: "post", action })
          };

          return (
            <>
              <p id="child-data">{data}</p>
              <button id="index-fetcher" onClick={invokeFetcher}>Invoke Index Fetcher</button>
              {!!fetcher.data && <p id="index-fetcher-data">{fetcher.data}</p>}
            </>
          );
        }
      `,

      "app/routes/layout-action/$param.jsx": js`
        import { json } from "@remix-run/node";
        import {
          useFetcher,
          useFormAction,
          useLoaderData,
        } from "@remix-run/react";

        export let loader = ({ params }) => json(params.param);

        export let action = ({ params }) => json("param action data");

        export default function ActionLayoutChild() {
          let data = useLoaderData();
          let fetcher = useFetcher();
          let action = useFormAction();
          
          let invokeFetcher = () => {
            fetcher.submit({}, { method: "post", action })
          };

          return (
            <>
              <p id="child-data">{data}</p>
              <button id="param-fetcher" onClick={invokeFetcher}>Invoke Param Fetcher</button>
              {!!fetcher.data && <p id="param-fetcher-data">{fetcher.data}</p>}
            </>
          );
        }
      `,

      "app/routes/layout-loader.jsx": js`
        import { json } from "@remix-run/node";
        import { Outlet, useFetcher, useFormAction } from "@remix-run/react";

        export let loader = () => json("layout loader data");

        export default function LoaderLayout() {
          let fetcher = useFetcher();
          let action = useFormAction();

          let invokeFetcher = () => {
            fetcher.load(action);
          };

          return (
            <div>
              <h1>Layout</h1>
              <button onClick={invokeFetcher}>Invoke Fetcher</button>
              {!!fetcher.data && <p id="layout-fetcher-data">{fetcher.data}</p>}
              <Outlet />
            </div>
          );
        }
      `,

      "app/routes/layout-loader/index.jsx": js`
        import { json } from "@remix-run/node";
        import {
          useFetcher,
          useFormAction,
          useLoaderData,
        } from "@remix-run/react";

        export let loader = ({ params }) => json("index data");

        export default function ActionLayoutIndex() {
          let fetcher = useFetcher();
          let action = useFormAction();
          
          let invokeFetcher = () => {
            fetcher.load(action);
          };

          return (
            <>
              <button id="index-fetcher" onClick={invokeFetcher}>Invoke Index Fetcher</button>
              {!!fetcher.data && <p id="index-fetcher-data">{fetcher.data}</p>}
            </>
          );
        }
      `,

      "app/routes/layout-loader/$param.jsx": js`
        import { json } from "@remix-run/node";
        import {
          useFetcher,
          useFormAction,
          useLoaderData,
        } from "@remix-run/react";

        export let loader = ({ params }) => json(params.param);

        export default function ActionLayoutChild() {
          let fetcher = useFetcher();
          let action = useFormAction();
          
          let invokeFetcher = () => {
            fetcher.load(action);
          };

          return (
            <>
              <button id="param-fetcher" onClick={invokeFetcher}>Invoke Param Fetcher</button>
              {!!fetcher.data && <p id="param-fetcher-data">{fetcher.data}</p>}
            </>
          );
        }
      `,
    },
  });

  app = await createAppFixture(fixture);
});

afterAll(async () => app.close());

it("fetcher calls layout route action when at index route", async () => {
  await app.goto("/layout-action");
  await app.clickElement("button");
  let dataElement = await app.getElement("#layout-fetcher-data");
  expect(dataElement.text()).toBe("layout action data");
  dataElement = await app.getElement("#child-data");
  expect(dataElement.text()).toBe("index data");
});

it("fetcher calls layout route loader when at index route", async () => {
  await app.goto("/layout-loader");
  await app.clickElement("button");
  let dataElement = await app.getElement("#layout-fetcher-data");
  expect(dataElement.text()).toBe("layout loader data");
});

it("fetcher calls index route action when at index route", async () => {
  await app.goto("/layout-action");
  await app.clickElement("#index-fetcher");
  let dataElement = await app.getElement("#index-fetcher-data");
  expect(dataElement.text()).toBe("index action data");
  dataElement = await app.getElement("#child-data");
  expect(dataElement.text()).toBe("index data");
});

it("fetcher calls index route loader when at index route", async () => {
  await app.goto("/layout-loader");
  await app.clickElement("#index-fetcher");
  let dataElement = await app.getElement("#index-fetcher-data");
  expect(dataElement.text()).toBe("index data");
});

it("fetcher calls layout route action when at paramaterized route", async () => {
  await app.goto("/layout-action/foo");
  await app.clickElement("button");
  let dataElement = await app.getElement("#layout-fetcher-data");
  expect(dataElement.text()).toBe("layout action data");
  dataElement = await app.getElement("#child-data");
  expect(dataElement.text()).toBe("foo");
});

it("fetcher calls layout route loader when at paramaterized route", async () => {
  await app.goto("/layout-loader/foo");
  await app.clickElement("button");
  let dataElement = await app.getElement("#layout-fetcher-data");
  expect(dataElement.text()).toBe("layout loader data");
});

it("fetcher calls paramaterized route route action", async () => {
  await app.goto("/layout-action/foo");
  await app.clickElement("#param-fetcher");
  let dataElement = await app.getElement("#param-fetcher-data");
  expect(dataElement.text()).toBe("param action data");
  dataElement = await app.getElement("#child-data");
  expect(dataElement.text()).toBe("foo");
});

it("fetcher calls paramaterized route route loader", async () => {
  await app.goto("/layout-loader/foo");
  await app.clickElement("#param-fetcher");
  let dataElement = await app.getElement("#param-fetcher-data");
  expect(dataElement.text()).toBe("foo");
});
