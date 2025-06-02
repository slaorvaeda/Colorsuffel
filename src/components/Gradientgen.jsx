import React, { useState } from 'react';

function Gradientgen() {
    const [color1, setColor1] = useState('#ff0000');
    const [color2, setColor2] = useState('#0000ff');

    const handleColor1Change = (e) => setColor1(e.target.value);
    const handleColor2Change = (e) => setColor2(e.target.value);

    return (
        <div>
        <h1 className="text-3xl font-bold py-5 text-center">Gradient Generator</h1>

            <div className='p-2 m-auto rounded-2xl'
                style={{
                    width: '94%',
                    height: '70vh',
                    background: `linear-gradient(to right, ${color1}, ${color2})`,
                }}
            ></div>
            <div className='m-auto flex justify-center space-x-4'>
                <input type="color" value={color1} onChange={handleColor1Change} />
                <input type="color" value={color2} onChange={handleColor2Change} />
            </div>
        </div>
    );
}

export default Gradientgen;