import React from 'react'
const people = [
    {
      name: "Amanda Reyes",
      role: "Marketing Manager at Alibaba Group",
      image: "data:image/jpeg;base64,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",
    },
    {
      name: "Han Ryujin",
      role: "CTO at Google",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Paul Arriola",
      role: "Lead Engineer at Tesla",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Tafari Sans",
      role: "Principal Designer at Spotify",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Velasco Timmber",
      role: "Sr. Product Designer at Netflix",
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Velasco Timmber",
      role: "Sr. Product Designer at Netflix",
      image: "/placeholder.svg?height=40&width=40",
    },
    
  ]

const PeopleViewd = () => {
    return (
        <div className="hidden h-full lg:block  sticky top-20 max-w-sm bg-white rounded-lg p-4 md:col-span-3">
          <h2 className="text-base font-medium text-gray-900 mb-4">People also viewed</h2>
          <div className="space-y-2">
            {people.map((person, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={person.image || "/placeholder.svg"} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{person.name}</h3>
                    <p className="text-sm text-gray-500">{person.role}</p>
                  </div>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50">
                  <span className="text-gray-500 text-lg">+</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )
}

export default PeopleViewd
