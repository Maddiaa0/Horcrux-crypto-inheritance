import React from 'react';

const Emoji = React.forwardRef(function Emoj(props, ref) {
    //  Spread the props to the underlying DOM element.
    return <span
        {...props} ref={ref}
        className="emoji"
        role="img"
        aria-label={props.label ? props.label : ""}
        aria-hidden={props.label ? "false" : "true"}
    >
        {props.symbol}
    </span> 
});

export default Emoji;