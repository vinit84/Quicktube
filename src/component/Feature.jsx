import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Approve to Upload',
    description:
      'Easily deploy your video edits with just one click. No more waiting for uploads or downloads!',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Two-Step Auth',
    description: 'Protect your videos and data with Anamolies. Ensure your content remains secure and private.',
    icon: LockClosedIcon,
  },
  {
    name: 'Database Backups',
    description: 'Automatically back up your video files and metadata. Never lose your work again!',
    icon: ServerIcon,
  },
]


export default function Feature() {
  return (
    <div className="overflow-hidden bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base Gilroy-SemiBold leading-7 text-indigo-600">Deploy faster</h2>
              <p className="mt-2 text-3xl Gilroy-Bold tracking-tight text-white sm:text-4xl">Seamless Workflow</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
              We offer reliable, scalable, and customizable solutions for your YouTube channel. Whether you need to manage videos, collaborate with editors, or streamline your approval process, QuickTube has got you covered.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
            alt="Product screenshot"
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
            width={2432}
            height={1442}
          />
        </div>
      </div>
    </div>
  )
}
