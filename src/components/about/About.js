import React from 'react';
import './about.scss';

const About = React.forwardRef((props, ref) => {
    return <div className="about" ref={ref}>Hello</div>;
})

export default About;