import TextareaAutosize from 'react-textarea-autosize';
import PropTypes from 'prop-types';
import styles from './textarea.module.scss'

export default function Textarea ({type, value, name, onChange, placeholder}){
    return(

        <TextareaAutosize
            className={type === 'row' ? styles.textarea : styles.title}
            minRows={1}
            maxRows={6}
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
        />
    )
}

Textarea.propTypes = {
    type: PropTypes.string,
    value: PropTypes.string,
    name: PropTypes.number,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,


};