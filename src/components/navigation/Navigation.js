import React from 'react';
import './navigation.scss';

function Link({ targetRef, refInView }) {
    const handleClick = () => {
        if (targetRef && targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return <button className={'navigationLink' + (refInView === targetRef ? ' active' : '')} onClick={handleClick}>
        Yote
    </button>
}

function Navigation({ refs, refInView }) {
    return <div className="navigation">
        {refs.map((ref, index) => {
            return <Link key={index} targetRef={ref} refInView={refInView} />
        })}
    </div>;   
}

export default Navigation;