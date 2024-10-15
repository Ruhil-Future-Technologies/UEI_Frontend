import React, { useState, useEffect } from 'react'
import ThemeSidebar from '../ThemeSidebar/ThemeSidebar';

const FAQ = () => {
    const [themeMode, setThemeMode] = useState<string>("")
    useEffect(() => {
        const newTheme = localStorage.getItem("theme");
        setThemeMode(newTheme || "light");
    }, [])

    return (
        <>
            <div className="main-wrapper">
                <div className="main-content">
                    {/* <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                        <div className="breadcrumb-title pe-3">Components</div>
                        <div className="ps-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0 p-0">
                                    <li className="breadcrumb-item"><a href=""><i className="bx bx-home-alt"></i></a>
                                    </li>
                                    <li aria-current="page">FAQ</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="ms-auto">
                            <div className="btn-group">
                                <button type="button"
                                    className="btn btn-outline-primary rounded-pill px-lg-4"
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#staticBackdrop">Settings</button>

                            </div>
                        </div> 
                    </div> */}

                    <div className="row">
                        <div className="col-12">
                            <div className="text-start">
                                <h5 className="mb-0 text-uppercase">Frequently asked questions (FAQ<small
                                    className="text-lowercase">s</small>)</h5>
                                <hr />
                            </div>

                        </div>
                        <div className="col-lg-6">
                            <div className="accordion accor-des" id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            Just once I'd like to eat dinner with a celebrity?
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>Yes, if you make it look like an electrical fire. When you do things right,
                                                people won't be sure you've done anything at all. I was having the most
                                                wonderful dream. Except you were there, and you were there, and you were there!
                                                No argument here. Goodbye, cruel world. Goodbye, cruel lamp. Goodbye, cruel
                                                velvet drapes, lined with what would appear to be some sort of cruel muslin and
                                                the cute little pom-pom curtain pull cords. Cruel though they may be.</p>
                                            <p><strong>Example: </strong>Shut up and get to the point!</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                            Bender, I didn't know you liked cooking?
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>That's so cute. Can we have Bender Burgers again? Is the Space Pope reptilian!? I
                                                wish! It's a nickel. Bender! Ship! Stop bickering or I'm going to come back
                                                there and change your opinions manually!</p>
                                            <p><strong>Example: </strong>Okay, I like a challenge. Is that a cooking show? No
                                                argument here.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                            My fellow Earthicans?
                                        </button>
                                    </h2>
                                    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>As I have explained in my book 'Earth in the Balance', and the much more popular
                                                'Harry Potter and the Balance of Earth', we need to defend our planet against
                                                pollution. Also dark wizards. Fry, you can't just sit here in the dark listening
                                                to classical music.</p>
                                            <p><strong>Example: </strong>Actually, that's still true. Well, let's just dump it
                                                in the sewer and say we delivered it.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingFour">
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                            data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                            Who am I making this out to?
                                        </button>
                                    </h2>
                                    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour"
                                        data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <p>Morbo can't understand his teleprompter because he forgot how you say that letter
                                                that's shaped like a man wearing a hat. Also Zoidberg. Can we have Bender
                                                Burgers again? Goodbye, cruel world. Goodbye, cruel lamp. Goodbye, cruel velvet
                                                drapes, lined with what would appear to be some sort of cruel muslin and the
                                                cute little pom-pom curtain pull cords.</p>
                                            <p><strong>Example: </strong>Cruel though they may be...</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ThemeSidebar themeMode={themeMode} setThemeMode={setThemeMode} />
        </>
    )
}

export default FAQ