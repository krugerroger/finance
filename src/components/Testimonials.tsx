// src/components/Testimonials.js
export default function Testimonials() {
    const testimonials = [
      {
        name: 'Marie D.',
        role: 'Investisseuse depuis 2020',
        content: 'Grâce à Finance, j\'ai pu diversifier mon épargne dans l\'immobilier sans les contraintes de la gestion locative. Les rendements sont conformes aux promesses.',
        avatar: '/images/avatar1.jpg'
      },
      {
        name: 'Pierre L.',
        role: 'Investisseur depuis 2019',
        content: 'La plateforme est très intuitive et l\'équipe très réactive. J\'apprécie particulièrement la qualité des dossiers de présentation des projets.',
        avatar: '/images/avatar2.jpg'
      }
    ]
  
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Ils nous font confiance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }