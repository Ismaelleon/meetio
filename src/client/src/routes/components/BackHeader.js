import { BiArrowBack } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';

function BackHeader (props) {
    let history = useHistory();

    return (
        <header className="px-5 py-3">
            <Link><BiArrowBack className="text-2xl" onClick={() => history.goBack()} /></Link>
        </header>
    );
}

export default BackHeader;
