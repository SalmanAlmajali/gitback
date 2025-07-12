const features = [
    '📬 Form feedback publik',
    '🔗 Integrasi langsung ke GitHub API',
    '🧠 AI untuk ubah feedback jadi bahasa teknis',
    '📊 Dashboard feedback + status sinkronisasi',
    '🔐 Dukungan multi-user dan token GitHub terenkripsi'
]

export default function Features() {
    return (
        <section
            id="features"
            className="py-20 px-6"
        >
            <h2 className="text-3xl font-semibold text-center mb-8">Fitur Utama</h2>
            <ul className="max-w-xl mx-auto space-y-4 text-left">
                {features.map((f, i) => (
                    <li key={i} className="text-lg">✅ {f}</li>
                ))}
            </ul>
        </section>
    )
}
