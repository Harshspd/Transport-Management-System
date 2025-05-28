export const fetchIndustryOptions = (req, res) => {
    const industryOptions = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Retail',
        'Manufacturing',
        'Real Estate',
        'Transportation',
        'Entertainment',
        'Hospitality',
        'Agriculture',
        'Energy',
        'Telecommunications',
        'Construction',
        'Legal',
        'Marketing',
        'Non-Profit',
        'Government',
        'Consulting',
        'Food & Beverage'
    ];

    res.json(industryOptions);
};

