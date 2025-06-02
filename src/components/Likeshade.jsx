import React, { useEffect, useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";

function Likeshade({ onLike }) {
    const [likedShades, setLikedShades] = useState([]);

    useEffect(() => {
        const storedShades = JSON.parse(localStorage.getItem('likedShades')) || [];
        const uniqueShades = [...new Set(storedShades)];
        setLikedShades(uniqueShades);
        localStorage.setItem('likedShades', JSON.stringify(uniqueShades));
    }, []);

    const handleDelete = (shadeToDelete) => {
        const updatedShades = likedShades.filter(shade => shade !== shadeToDelete);
        setLikedShades(updatedShades);
        localStorage.setItem('likedShades', JSON.stringify(updatedShades));
    };

    console.log("Rendering Likeshade with:", likedShades);

    return (
        <>
            <h2 className='text-2xl font-bold text-center my-5'>Liked Shades</h2>
            <div className="liked-shades-container w-[90%]  items-center m-auto " style={{ display: 'flex', flexWrap: 'wrap' }}>
                {likedShades.length === 0 ? (
                    <p>No liked shades yet.</p>
                ) : (
                    likedShades.map((shade, index) => (
                        <div key={index} className="liked-shade my-1 rounded-2xl text-[14px]" style={{ backgroundColor: shade, height: '70px', width: '70px',marginRight:'4px', position: 'relative' }}>
                            {shade}
                            <button onClick={() => handleDelete(shade)} style={{ position: 'absolute', bottom: '5px', right: '5px' }}><MdDeleteOutline /></button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default Likeshade;
