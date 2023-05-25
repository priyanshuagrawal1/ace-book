
import './right.css';
import instagram from "../images/Instagram.png"
const Right: React.FC = () => {
    let index = 0;
    const headings = ['Meet the Control Hub', 'Meet the Visual builder', 'Meet the Exchange Hub'];

    let baseText = headings[index];

    return (
        <div className="right">
            <img src={instagram} style={{height:"450px",}}></img>
            <div className="bottomText">
                <h2 className="heading">{baseText}</h2>
                <p className="para">Camel Cloud's visual integration builder lets you build integrations in real time in a beautiful, intuitive way.</p>
                <div className="navigation">
                    <div className={index === 0 ? 'selectedDot' : 'dot'}></div>
                    <div className={index === 1 ? 'selectedDot' : 'dot'}></div>
                    <div className={index === 2 ? 'selectedDot' : 'dot'}></div>
                </div>
 
            </div>
        </div>
    );
};

export default Right;
