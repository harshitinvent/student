import PageTitleArea from "../../components/shared/PageTitleArea";

export default function CourseLessonPage() {
  return (
    <div className={"flex min-h-full flex-col"}>
      <PageTitleArea>
        <div>
          <h1 className={"text-h5 text-textHeadline font-medium"}>
            Introduction to Psychology
          </h1>
          <p
            className={
              "text-textDescription text-body-l mt-6 flex items-center gap-16 font-medium"
            }
          >
            <span>12 weeks</span>
            <span>(24 classes)</span>
          </p>
        </div>
      </PageTitleArea>

      <div className={"flex-1 px-48 pb-24"}>
        <div className={"sticky top-32 float-start mt-32 mr-12 w-322 shrink-0"}>
          <p className={"text-16 text-textHeadline font-semibold"}>
            Categories
          </p>
          <ul className={"text-14 text-textDescription mt-20 grid gap-8"}>
            <li
              className={
                "text-iconBlue cursor-pointer transition-colors duration-300 hover:opacity-90"
              }
            >
              Smarter Assets
            </li>
            <li
              className={
                "cursor-pointer transition-colors duration-300 hover:opacity-90"
              }
            >
              What’s new
            </li>
            <li
              className={
                "cursor-pointer transition-colors duration-300 hover:opacity-90"
              }
            >
              Smoother Workflow
            </li>
          </ul>
        </div>

        <div
          className={
            "shadow-s1 border-linePr reach-content rounded-8 inline-block max-w-555 border bg-white p-24"
          }
        >
          <h2>Smarter Assets. Smoother Workflow.</h2>
          <p>
            The new 3D Library update gives creators instant access to a richer,
            smarter library of AI-ready assets. Whether you're building
            characters, props, or environments — your favorite elements are now
            faster to find and easier to use.
          </p>

          <h2>What’s new</h2>
          <p>
            Unified Search: Browse by type, theme, or prompt tags — all in one
            place Smart Categories: Characters, Environments, Props, Animations,
            and FX — now neatly grouped Live Preview: See animated models in
            motion before adding them Favorites & History: Quickly find what you
            used or loved before Optimized for AI Prompts: Each asset is labeled
            for best AI pairing and results This is part of our continued effort
            to make 3D creation intuitive and fun, powered by AI and designed
            for speed. Dive in and explore what’s new — your creative toolbox
            just leveled up.
          </p>
          <h2>What’s new</h2>
          <p>
            Unified Search: Browse by type, theme, or prompt tags — all in one
            place Smart Categories: Characters, Environments, Props, Animations,
            and FX — now neatly grouped Live Preview: See animated models in
            motion before adding them Favorites & History: Quickly find what you
            used or loved before Optimized for AI Prompts: Each asset is labeled
            for best AI pairing and results This is part of our continued effort
            to make 3D creation intuitive and fun, powered by AI and designed
            for speed. Dive in and explore what’s new — your creative toolbox
            just leveled up.
          </p>

          <h2>Smarter Assets. Smoother Workflow.</h2>
          <p>
            The new 3D Library update gives creators instant access to a richer,
            smarter library of AI-ready assets. Whether you're building
            characters, props, or environments — your favorite elements are now
            faster to find and easier to use.
          </p>

          <h2>What’s new</h2>
          <p>
            Unified Search: Browse by type, theme, or prompt tags — all in one
            place Smart Categories: Characters, Environments, Props, Animations,
            and FX — now neatly grouped Live Preview: See animated models in
            motion before adding them Favorites & History: Quickly find what you
            used or loved before Optimized for AI Prompts: Each asset is labeled
            for best AI pairing and results This is part of our continued effort
            to make 3D creation intuitive and fun, powered by AI and designed
            for speed. Dive in and explore what’s new — your creative toolbox
            just leveled up.
          </p>
          <h2>What’s new</h2>
          <p>
            Unified Search: Browse by type, theme, or prompt tags — all in one
            place Smart Categories: Characters, Environments, Props, Animations,
            and FX — now neatly grouped Live Preview: See animated models in
            motion before adding them Favorites & History: Quickly find what you
            used or loved before Optimized for AI Prompts: Each asset is labeled
            for best AI pairing and results This is part of our continued effort
            to make 3D creation intuitive and fun, powered by AI and designed
            for speed. Dive in and explore what’s new — your creative toolbox
            just leveled up.
          </p>
        </div>
      </div>
    </div>
  );
}
