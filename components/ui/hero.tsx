import { SvgIcon } from "./application-logo";

export default function Hero() {
    return (
        <section
            id="top"
            className="py-32 px-6 text-center bg-neutral-200 dark:bg-neutral-900"
        >
            <SvgIcon className="size-29 my-6 m-auto" />
            <h1 className="text-5xl font-bold mb-4">Gitback</h1>
            <p className="text-lg max-w-2xl mx-auto">
                Platform sederhana untuk menerima dan mengelola feedback pengguna,
                lalu mengubahnya menjadi issue di GitHub secara otomatis.
            </p>
        </section>
    )
}
