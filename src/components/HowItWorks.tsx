// src/components/HowItWorks.js
export default function HowItWorks() {
    const steps = [
      {
        number: '1',
        title: 'Choisissez un projet',
        description: 'Sélectionnez un projet immobilier qui correspond à vos critères'
      },
      {
        number: '2',
        title: 'Investissez',
        description: 'Particpez avec un montant à partir de 500€'
      },
      {
        number: '3',
        title: 'Suivez et encaissez',
        description: 'Recevez des rapports réguliers et vos revenus'
      }
    ]
  
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-16 left-1/2 transform -translate-x-1/2 h-1 bg-blue-200 w-2/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold mt-6 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }