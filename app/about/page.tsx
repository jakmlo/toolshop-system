export default function Component() {
  return (
    <main className="w-full border-t py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              About Us
            </h2>
            <p className="max-w-[800px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We&apos;re on a mission to provide the best-in-class internal
              system for renting building equipment. Our platform is designed to
              streamline the rental process, making it easier for construction
              companies to access the tools and machinery they need to get the
              job done. With a focus on efficiency and reliability, we&apos;re
              transforming the way equipment rentals are managed.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">Meet the Team</h3>
            <p className="text-gray-500 dark:text-gray-400">
              We&apos;re a dedicated team of professionals with expertise in
              software development, user experience design, and customer
              support. Here are the key members of our team:
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-2">
            <ul className="grid gap-4">
              <li>
                <div className="grid gap-1">
                  <h4 className="text-xl font-bold">Jacob Hammer</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    CEO & Co-Founder
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h4 className="text-xl font-bold">Jacob Club</h4>
                  <p className="text-gray-500 dark:text-gray-400">CTO</p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h4 className="text-xl font-bold">Jacob Musk</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Head of Product
                  </p>
                </div>
              </li>
              <li>
                <div className="grid gap-1">
                  <h4 className="text-xl font-bold">Jacob Plump</h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Customer Success Manager
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
