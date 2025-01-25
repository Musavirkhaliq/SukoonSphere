import React from 'react'
import MentalHeathSummary from '@/utils/about/MentalHealth'
import bgImg from '../../assets/images/mentalHealthImg.jpg'
import { Link } from 'react-router-dom'

function MentalHealth() {
    return (
        <>
            <div className="p-4  lg:p-8 rounded-lg max-w-7xl mx-auto space-y-8 md:space-y-16">
                <h2 className=" font-bold text-[2rem] md:text-[2.5rem] text-[var(--grey--900)]">Mental health</h2>
                {/* Overview Section */}
                <section className=" mb-8 grid grid-cols-12 gap-6" data-aos="fade-up" data-aos-duration="1500">
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-6 gap-4">
                        <img src="https://media.licdn.com/dms/image/D5612AQEAqaIf0Cs-Hg/article-cover_image-shrink_720_1280/0/1710397777437?e=2147483647&v=beta&t=soZaslp-9gmLUCwNt2SiEgi46mgsyI7yBQrVm1L3fW8"
                            alt="Image loading..."
                            className='rounded-lg' />
                    </div>
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-6 ">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                            {MentalHeathSummary.overview.title}
                        </h2>
                        {/* <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.overview.description}</p> */}
                        <p className="text-[var(--grey--800)] text-base">
                            Mental illness, also called <strong> <mark> mental health disorders </mark></strong>, refers to a wide range of mental health conditions — <strong> <mark> disorders that affect your mood, thinking and behavior </mark></strong>. Examples of mental illness <strong><mark> include depression, anxiety disorders, schizophrenia, eating disorders and addictive behaviors </mark></strong>. Many people have mental health concerns from time to time. But a mental health concern becomes a mental illness when <strong> <mark> ongoing signs and symptoms cause frequent stress and affect your ability to function</mark></strong>. A mental illness can make you miserable and can cause problems in your daily life, such as at school or work or in relationships. In most cases, symptoms can be managed with a combination of medications and talk therapy (psychotherapy).
                        </p>
                    </div>
                </section>

                {/* Symptoms Section */}

                <section className="mb-8 grid grid-cols-12 gap-6" data-aos="fade-up" data-aos-duration="1500">
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-6 gap-4">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                            {MentalHeathSummary.symptoms.title}
                        </h2>

                        <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.symptoms.description}</p>
                        <ul className="list-disc list-inside mt-4" style={{ color: 'var(--black-color)' }}>
                            {MentalHeathSummary.symptoms.examples.map((symptom, index) => (
                                <li key={index} className='mt-1'><strong>{symptom}</strong></li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-12 order-1 lg:order-2 lg:col-span-6">
                        <img src=" https://www.beyondpsychub.com/wp-content/uploads/2023/01/SIGNS-AND-SYMPTOMS-OF-MENTAL-HEALTH-DISORDERS-1.png"
                            alt="Image loading..."
                            className='rounded-lg' />
                    </div>
                </section>

                {/* When to see a Doctor */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {MentalHeathSummary.doctor.title}
                    </h2>
                    <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.doctor.description}</p>
                </section>

                {/* Suicidal Thoughts Section */}
                <section className="mb-8 bg-[var(--brand--goldenrod)] p-4 rounded-lg glossy-effect-bar" data-aos="fade-up" data-aos-duration="1500">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {MentalHeathSummary.suicidalThoughts.title}
                    </h2>
                    <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.suicidalThoughts.description}</p>
                    <ul className="list-disc list-inside" style={{ color: 'var(--black-color)' }}>
                        {MentalHeathSummary.suicidalThoughts.actions.map((action, index) => (
                            <li key={index}><strong>{action}</strong></li>
                        ))}
                    </ul>
                </section>

                {/* Helping Others Section
                <section className="mb-8" data-aos="fade-up" data-aos-duration="1500">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                        {MentalHeathSummary.heplingOthers.title}
                    </h2>
                    <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.heplingOthers.description}</p>
                    <Link to="/contact-us" className=" mt-4 btn-1 glossy-effect-bar w-1/4" >One-on-One counselling</Link>
                </section> */}

                {/* Causes Section */}
                <section className="mb-8 grid grid-cols-12 gap-6" data-aos="fade-up" data-aos-duration="1500">
                    <div className="col-span-12 order-1 lg:order-1 lg:col-span-6">
                        <img src=" https://lirp.cdn-website.com/b12c687e/dms3rep/multi/opt/infographic-on-20-ways-to-beat-mental-stress-640w.png"
                            alt="Image loading..."
                            className='rounded-lg' />
                    </div>
                    <div className="col-span-12 order-2 lg:order-2 lg:col-span-6 gap-4">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                            {MentalHeathSummary.causes.title}
                        </h2>
                        <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.causes.description}</p>
                        <ul className="list-disc list-inside mt-4" style={{ color: 'var(--black-color)' }}>
                            {MentalHeathSummary.causes.factors.map((cause, index) => (
                                <li key={index} className='mt-2'>
                                    <mark>{cause.name}: </mark> &nbsp;&nbsp;  {cause.description}
                                </li>
                            ))}
                        </ul>

                    </div>
                </section>

                {/* Risk Factors Section */}

                <section className="mb-8 grid grid-cols-12 gap-6" data-aos="fade-up" data-aos-duration="1500">
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-6 gap-4">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                            {MentalHeathSummary.riskFactors.title}
                        </h2>
                        <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.riskFactors.description}</p>
                        <ul className="list-disc list-inside mt-4" style={{ color: 'var(--black-color)' }}>
                            {MentalHeathSummary.riskFactors.factors.map((factor, index) => (
                                <li key={index} className='mt-1'><strong>{factor}</strong></li>
                            ))}
                        </ul>
                        <p className="text-[var(--grey--800)] text-base mt-4">{MentalHeathSummary.riskFactors.note}</p>
                    </div>
                    <div className="col-span-12 order-1 lg:order-2 lg:col-span-6">
                        <img src=" https://cdn.slidesharecdn.com/ss_thumbnails/riskfactorsindevelopmentofmentalhealthillness-211004171809-thumbnail.jpg?width=640&height=640&fit=bounds"
                            alt="Image loading..."
                            className='rounded-lg' />
                    </div>
                </section>

                {/* Complications Section */}
                <section className="mb-8 grid grid-cols-12 gap-6" data-aos="fade-up" data-aos-duration="1500">
                    <div className="col-span-12 order-1 lg:order-1 lg:col-span-6">
                        <img src="https://d2jx2rerrg6sh3.cloudfront.net/images/Article_Images/ImageForArticle_22028_16430272124432966.jpg"
                            alt="Image loading..."
                            className='rounded-lg' />
                    </div>
                    <div className="col-span-12 order-2 lg:order-2 lg:col-span-6 gap-4">
                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                            {MentalHeathSummary.complications.title}
                        </h2>
                        <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.complications.description}</p>
                        <ul className="list-disc list-inside mt-4" style={{ color: 'var(--black-color)' }}>
                            {MentalHeathSummary.complications.list.map((complication, index) => (
                                <li key={index} className='mt-1'><strong>{complication}</strong></li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Prevention Section */}

                <section className="mb-8 grid grid-cols-12 gap-6" data-aos="fade-up" data-aos-duration="1500">
                    <div className="col-span-12 order-2 lg:order-1 lg:col-span-6 gap-4">

                        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>
                            {MentalHeathSummary.prevention.title}
                        </h2>
                        <p className="text-[var(--grey--800)] text-base">{MentalHeathSummary.prevention.description}</p>
                        <ul className="list-disc list-inside mt-4" style={{ color: 'var(--black-color)' }}>
                            {MentalHeathSummary.prevention.steps.map((step, index) => (
                                <li key={index}>
                                    <strong><mark>{step.title}: </mark></strong>{step.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-span-12 order-1 lg:order-2 lg:col-span-6">
                        <img src="https://www.gigadocs.com/blog/wp-content/uploads/2020/09/Suicide-Prevention-Caring-for-Mental-Health-and-Depression-to-Fight-Covid-19-.jpg"
                            alt="Image loading..."
                            className='rounded-lg' />
                    </div>
                </section>
            </div>
        </>
    )
}

export default MentalHealth
