
interface SectionsPageProps {
    sectionsData: string | null;
    setSectionsData: React.Dispatch<React.SetStateAction<string | null>>;
}

const SectionsPage: React.FC<SectionsPageProps> = ({ sectionsData, setSectionsData }) => {

    const handleSelection = (value: string) => {
        setSectionsData(value);
    };


    const options = [
        { id: 'option1', label: 'Mentor', value: 'Mentor', image: 'images/undraw_business_chat_re_gg4h.svg' },
        { id: 'option2', label: 'Trader', value: 'Trader', image: 'images/undraw_candidate_ubwv.svg' },
        { id: 'option4', label: 'Employer', value: 'Employer', image: 'images/undraw_business_deal_re_up4u.svg' },
    ]


    return (
        <div className="space-y-6"
        >
            <div className="mt-2">
                <div className="text-xl/8 font-semibold text-gray-900 sm:text-lg/9">
                    <p>Sections</p>
                </div>

                <div>Select a section</div>
            </div>

            <div className="mt-6 p-2 overflow-y-auto h-[400px]">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {options?.map((option) => (
                        <label
                            key={option.id}
                            className={` cursor-pointer border rounded-lg shadow-md overflow-hidden transition transform ${ sectionsData === option.value
                                    ? 'border-blue-500 scale-105'
                                    : 'border-gray-300'
                                }`}
                        >
                            <input
                                type="radio"
                                name="card"
                                value={option.value}
                                className="sr-only"
                                onChange={() => handleSelection(option.value)}
                            />
                            <div className="flex flex-col p-1">
                                <img
                                    src={option.image}
                                    alt={option.label}
                                    className="w-full h-28 bg-gray-50 object-cover rounded-t-lg"
                                />
                                <span className="p-4 text-md font-semibold">{option.label}</span>
                            </div>
                        </label>
                    ))}
                </div> 
            </div>
        </div>
    );
};

export default SectionsPage;
