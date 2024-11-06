import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Banner from '~/components/banner';

export default component$(() => {
  return (
    <div class="min-h-screen flex justify-center">
      <Banner />
    </div>
  );
})

export const head: DocumentHead = {
  title: "Social Banner",
  meta: [
    {
      name: "description",
      content: "Customizable social media banner with icons",
    },
  ],
};
