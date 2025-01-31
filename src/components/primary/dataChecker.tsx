import moment from "moment";
import {useMemo} from "react";

const  DateCheckComponent = ({ date }) => {
    const { isJustAdded, durationFromNow } = useMemo(() => {
        const now = moment();
        const targetDate = moment(date);

        if (!targetDate.isValid()) {
            throw new Error("Invalid date");
        }

        const oneDayFromNow = now.clone().add(1, 'day');
        const isJustAdded = targetDate.isBefore(oneDayFromNow);
        const durationFromNow = targetDate.fromNow();

        return { isJustAdded, durationFromNow };
    }, [date]);

    return (
        <h3
            className={`text-xs ${isJustAdded ? 'text-green-600' : 'text-gray-500'
            }`}
        >
            {isJustAdded ? 'Just Added' : `${durationFromNow} ago`}
        </h3>
    );
}

export default DateCheckComponent;