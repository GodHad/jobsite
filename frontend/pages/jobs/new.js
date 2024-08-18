import { Layout } from "../../components/shared/new/Layout";
import Head from "next/head";
import { CommonContent } from "../../components/shared/new/CommonContent";
import { CalendarToday } from "@material-ui/icons";
import { Slider, styled, Switch, FormControlLabel, withStyles, makeStyles, alpha, InputBase, FormControl, InputLabel, TextField, InputAdornment, Select, MenuItem } from "@material-ui/core";
import { useRef, useState } from "react";
import ProjectItem from "../../components/shared/ProjectItem";
import Image from "next/dist/client/image";
import React from 'react';

const matchedProjects = [
    {
        title: "UX/UI Designer - Senior",
        username: "סיסקו",
        workingNumber: 101141,
        created: "08/17/2024 10:32:02",
        location: "סן חוזה, קליפורניה",
        icon: "/assets/image/cisco 2.png",
        type: "טלקום"
    },
    {
        title: "User Experience Export",
        username: "אפל",
        workingNumber: 212341,
        created: "08/14/2024 13:32:02",
        location: "קופרטינו, קליפורניה",
        icon: "/assets/image/Apple_logo_black.svg.png",
        type: "אלקטרוניקה"
    }
];

const allProjects = [
    {
        title: "Design Head - Top",
        username: "מיקרוסופט",
        workingNumber: 230235,
        created: "08/14/2024 13:32:02",
        location: "נתניה, ישראל",
        icon: "/assets/image/microsoft 2.png",
        type: "תוכנה"
    },
    {
        title: "Client Relations and Management Officer",
        username: "מיקרוסופט",
        workingNumber: 443539,
        created: "08/14/2024 13:32:02",
        location: "שיקגו, אילינויס",
        icon: "/assets/image/Ellipse 113.png",
        type: "מסעדות"
    },
    {
        title: "UX Designer - Senior",
        username: "אינטל",
        workingNumber: 157937,
        created: "08/14/2024 13:32:02",
        location: "סנטה קלרה קליפורניה",
        icon: "/assets/image/intel 1.png",
        type: "מוליכים למחצה"
    },
    {
        title: "Product Manager",
        username: "איבמ",
        workingNumber: 531642,
        created: "08/14/2024 13:32:02",
        location: "ארמונק, ניו יורק",
        icon: "/assets/image/ibm 1.png",
        type: "שירותי וייעוץ IT"
    },
];

function JobIndex() {
    return (
        <>
            <Head>
                <title>Jobs</title>
            </Head>
            <Layout>
                <CommonContent />
                <Filter />
                <MatchedProjects projects={matchedProjects} />
                <JobDescription />
                <AllProjects projects={allProjects} />
                <Pagination />
            </Layout>
        </>
    )
}

export default JobIndex;

const marks = [
    {
        value: 0,
        label: '100k+',
    },
    {
        value: 20,
        label: '1k+',
    },
    {
        value: 40,
        label: '101 - 1k',
    },
    {
        value: 60,
        label: '21 - 100',
    },
    {
        value: 80,
        label: '0 - 20',
    },
    {
        value: 100,
        label: 'הכל',
    },
];

const CustomFormControlLabel = styled(FormControlLabel)(() => ({
    margin: 0,
    '& .MuiFormControlLabel-label': {
        marginLeft: '20px',
        fontWeight: 500,
        fontSize: 12,
        letterSpacing: 1,
        color: '#A6A3A3'
    },
}))

const CustomInputLabel = styled(InputLabel)(() => ({
    fontWeight: 500,
    fontSize: 14,
}))

const CustomFormControl = styled(FormControl)(() => ({
    '@media (max-width: 1380px)': {
        marginRight: '40px !important'
    },
    '& .MuiInputLabel-formControl': {
        right: 0,
        left: 'inherit'
    }
}))

const CustomRightFormControl = styled(FormControl)(() => ({
    '@media (max-width: 1380px)': {
        marginLeft: '20px !important'
    },
    '& .MuiInputLabel-formControl': {
        right: 0,
        left: 'inherit'
    }
}))


const iOSBoxShadow = '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
    height: 5,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        border: '2px solid #FF6C6C',
        '&:focus, &:hover, &.Mui-active': {
            boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
        '&:before': {
            content: '" "',
            width: '12px',
            height: '12px',
            backgroundColor: '#FF6C6C',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%'
        },
    },
    '& .MuiSlider-valueLabel': {
        display: 'none',
    },
    '& .MuiSlider-mark': {
        backgroundColor: '#c4c4c4',
    },
    '& .MuiSlider-markLabel': {
        marginTop: '10px',
        color: '#c4c4c4',
        fontWeight: 600,
        fontSize: '12px',
    },
    '& .MuiSlider-track': {
        border: 'none',
        height: 5,
        backgroundColor: '#d0d0d0',
    },
    '& .MuiSlider-rail': {
        opacity: 1,
        height: 5,
        boxShadow: 'inset 0px 0px 4px -2px #000',
        backgroundColor: 'rgb(255, 108, 108)'
    },
}));

const HiTechSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 56,
    height: 28,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(26px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: 'transparent',
                border: '1px solid rgba(189, 189, 189, 0.8)',
                opacity: 1,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 28,
        height: 28,
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#FF6C6C',
        opacity: 1,
        border: 0,
        borderRadius: 28 / 2,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));

const LocationInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: '20px',
            justifyContent: 'end'
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '248px',
        padding: '17px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        textAlign: 'right',
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '@media (max-width: 1380px)': {
            width: 127,
        }
    },
}))(InputBase);

const RoleInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: '20px',
        },
    },
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        width: '378px',
        padding: '17px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&::placeholder': {
            fontWeight: 400,
            fontSize: 16
        },
        '@media (max-width: 1380px)': {
            width: 260,
        }
    },
}))(InputBase);

const DateInput = styled(TextField)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    border: 'none',
    borderRadius: 4,
    height: 51,
    position: 'relative',
    'label + &': {
        marginTop: '20px'
    },
    '& .MuiInputBase-root': {
        justifyContent: 'space-between',
    },
    '& input': {
        width: '190px',
        padding: '17px 17px 17px 0',
        textAlign: 'right',
        '@media (max-width: 1380px)': {
            width: 100,
        }
    },
    '& .MuiInputAdornment-root': {
        marginLeft: '17px'
    },
    '& .MuiInput-underline': {
        '&::after': {
            display: 'none'
        },
        '&::before': {
            display: 'none'
        },
    },
}))

const dropdownStyles = makeStyles({
    underline: {
        borderBottom: "0px solid red !important",
        "&:hover": {
            borderBottom: "0px solid rgba(0,0,0,0)"
        }
    }
});


const BranchSelector = styled(Select)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    border: 'none',
    borderRadius: 4,
    height: 51,
    position: 'relative',
    'label + &': {
        marginTop: '20px'
    },
    '& .MuiSelect-select': {
        textAlign: 'right'
    },
    '& .MuiInputBase-root': {
        justifyContent: 'space-between',
        '&::after': {
            display: 'none'
        },
        '&::before': {
            display: 'none'
        },
    },
    '& input': {
        width: '318px',
        padding: '17px 17px 17px 0',
        textAlign: 'right',
    },
    '& .MuiInputAdornment-root': {
        marginLeft: '17px'
    },
}))

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing(1),
    },
    dateField: {
        '& .MuiInputAdornment-root': {
            order: -1, // Move the adornment to the left
        },
        '& .MuiInputAdornment-positionEnd': {
            marginLeft: 0, // Remove the default margin for the right side
            marginRight: theme.spacing(1), // Add margin on the left side
        },
        '& input[type="date"]': {
            paddingLeft: 0, // Adjust padding as needed
        },
    },
}));

function Filter() {
    const classes = useStyles();
    const ddnSt = dropdownStyles();
    const inputRef = useRef(null);
    const handleAdornmentClick = () => {
        if (inputRef.current) {
            inputRef.current.showPicker(); // This will open the date picker
        }
    };

    const [item, setItem] = useState("default");
    const handleChange = (event) => {
        setItem(event.target.value);
    };

    return (
        <>
            <style jsx>
                {`
                .filter-container {
                    background-color: rgba(202, 199, 199, .4);
                    padding: 90px 80px 80px;
                    border-radius: 8px;
                    flex-direction: row;
                    justify-content: space-between;
                }

                @media (max-width: 1380px) {
                    .filter-container {
                        flex-direction: column;
                    }
                }

                .hi-tech-employee {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }

                @media (max-width: 1380px) {
                    .hi-tech-employee {
                        align-items: center;
                    }
                }

                .hi-tech-filter {
                    font-family: 'Inter';
                    max-width: 187px;
                    margin-right: 113px;
                }

                .hi-tech-filter span {
                    color: #A6A3A3;
                }
                
                .hi-tech-filter-switch {
                    padding: 10px 0;
                    gap: 24px;
                    border-bottom: 1px solid rgba(189, 189, 189, 0.8)
                }
                
                .hi-tech-filter-switch span {
                    font-weight: 500;
                    font-size: 14px;
                    letter-spacing: 1px;
                }

                .btn-custom {
                    margin-top: 13px;
                    background-color: rgb(189, 189, 189);
                    border: 1px solid rgba(189, 189, 189, .8);
                    border-radius: 4px;
                    width: 100%;
                    height: 43px;
                }
                
                .number-of-employees h4 {
                    font-weight: 600;
                    font-size: 14px;
                    color: #000;
                }

                .slider-container {
                    width: 248px;
                }

                .location-role {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }

                @media (max-width: 1380px) {
                    .location-role {
                        align-items: center;
                    }
                }

                .location-filter {
                    display: flex;
                    flex-direction: column;
                }

                .role-filter {
                    display: flex;
                    flex-direction: column;
                }
            `}
            </style>
            <div className="d-flex filter-container">
                <div className="hi-tech-employee">
                    <div className="hi-tech-filter">
                        <div className="hi-tech-filter-switch d-flex flex-row align-items-center">
                            <CustomFormControlLabel
                                control={<HiTechSwitch sx={{ m: 1 }} defaultChecked />}
                                label="הייטק בלבד"
                            />
                        </div>
                        <button className="btn-custom"></button>
                    </div>
                    <div className="number-of-employees">
                        <h4>מספר עובדים בחברה</h4>
                        <div className="slider-container">
                            <IOSSlider
                                defaultValue={100}
                                step={null}
                                valueLabelDisplay="auto"
                                marks={marks}
                            />
                        </div>
                    </div>
                </div>
                <div className="location-role">
                    <div className="location-filter">
                        <CustomFormControl className={classes.margin}>
                            <CustomInputLabel shrink htmlFor="location-input">
                                מיקום
                            </CustomInputLabel>
                            <LocationInput id="location-input" placeholder="למשל תל אביב" />
                        </CustomFormControl>
                        <CustomFormControl className={classes.margin}>
                            <CustomInputLabel shrink htmlFor="posted-date-input">
                                :פורסם ב
                            </CustomInputLabel>
                            <DateInput
                                id="posted-date-input"
                                type="date"
                                inputRef={inputRef}
                                placeholder="dd/mm/yyyy"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" onClick={handleAdornmentClick}>
                                            <CalendarToday />
                                        </InputAdornment>
                                    ),
                                    classes: {
                                        root: classes.dateField,
                                    },
                                }}
                            />
                        </CustomFormControl>
                    </div>
                    <div className="role-filter">
                        <CustomRightFormControl className={classes.margin}>
                            <CustomInputLabel shrink htmlFor="role-input">
                                תפקיד
                            </CustomInputLabel>
                            <RoleInput id="role-input" placeholder="e.g. Senior Public Relation" />
                        </CustomRightFormControl>
                        <CustomRightFormControl className={classes.margin}>
                            <CustomInputLabel shrink htmlFor="branch-selector">
                                ענף
                            </CustomInputLabel>
                            <BranchSelector
                                id="role-selector"
                                defaultValue={"default"}
                                className={ddnSt.underline}
                                value={item}
                                onChange={handleChange}
                                disableUnderline
                            >
                                <MenuItem value="default">
                                    <em>למשל שיווק</em>
                                </MenuItem>
                            </BranchSelector>
                        </CustomRightFormControl>
                    </div>
                </div>
            </div>
        </>
    )
}

function MatchedProjects({ projects }) {
    return (
        <div className="matched-projects">
            {projects.map(project => (
                <ProjectItem key={project.title} project={project} />
            ))}
        </div>
    )
}

function AllProjects({ projects }) {
    return (
        <div className="all-projects">
            {projects.map(project => (
                <ProjectItem key={project.title} project={project} />
            ))}
        </div>
    )
}

function JobDescription() {
    return (
        <div className="job-description">
            <style jsx>
                {`
                    .job-description {
                        margin: 30px 70px 30px 57px;
                    }
                    
                    .job-description .job-description-row {
                        border-bottom: 1px solid rgba(0, 0, 0, .4);
                    }

                    .job-description .job-description-row:last-child {
                        border: none;
                    }
                    
                    .job-description .job-description-title {
                        gap: 22px;
                        font-weight: 600;
                        font-size: 18px;
                        line-height: 22px;
                        color: #1e202d;
                        font-family: 'Inter', sans-serif;
                        text-align: right;
                        padding: 20px 37px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: end;
                    }

                    .job-description .job-description-content {
                        padding: 41px 26px;
                    }

                    .job-description .job-description-content p {
                        font-weight: 400;
                        font-size: 14px;
                        line-height: 22px;
                        font-family: 'Inter';
                        color: #555555;
                    }

                    .job-description .job-description-content h3 {
                        margin: 12px 0;
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 22px;
                        color: #000;
                    }
                    
                    .job-description .company-brief-item {
                        width: 336px;
                    }

                    .job-description .company-brief h3 {
                        font-weight: 600;
                        font-size: 16px;
                        line-height: 22px;
                        color: #000;
                        margin-bottom: 40px;
                    }

                    .job-description .company-brief h4 {
                        font-weight: 400;
                        font-size: 12px;
                        line-height: 22px;
                        color: #000;
                        margin-bottom: 20px;
                    }
                `}
            </style>
            <div className="job-description-row job-description-title">
                <h2>תיאור משרה</h2>
            </div>
            <div className="job-description-row job-description-content">
                <p>
                    We are looking for a DevOps who will be responsible for our cloud infrastructure support.  The ideal candidate would promote  ommunication, integration, and collaboration for enhanced software <br />development productivity. In addition, s/he will develop  infrastructure to incorporate latest technology and best practices to improve operational performance.
                </p>
                <h3>Qualifications</h3>
                <ul>
                    <li><p>AT least 3 years of experience in DevOps and related positions with extensive DevOps solutions experience.
                    </p></li>
                    <li><p>BSc in Computer Science or equivalent University degree - an advantage.
                    </p></li>
                    <li><p>Experience building and leading a DevOps team that delivers and maintains a DevOps platform <br />and enables project/product teams to leverage DevOps capabilities.
                    </p></li>
                    <li><p>Leadership, listening, verbal and written communication skills, with an ability to communicate technical needs <br />to the Engineering team.</p></li>
                    <li><p>Strong experience scripting in Python and Bash.</p></li>
                    <li><p>Extensive knowledge and experience of the AWS Stack, Linux, cloud technologies, and network Infrastructure.</p></li>
                </ul>
                <div className="job-description-title">
                    <Image src={"/assets/image/apple 2.png"} width={36} height={36} />
                    <h2>אודות</h2>
                </div>
            </div>
            <div className="job-description-row job-description-content">
                <div className="company-brief d-flex flex-row">
                    <div className="company-brief-item">
                        <h4>Industry</h4>
                        <h3>Telecommunication</h3>
                    </div>
                    <div className="company-brief-item">
                        <h4>Location</h4>
                        <h3>San Jose, CA</h3>
                    </div>
                    <div className="company-brief-item">
                        <h4># of Employees</h4>
                        <h3>101,141</h3>
                    </div>
                </div>
                <p>Broadcom Inc. (NASDAQ: AVGO) is a global technology leader that designs,develops and supplies semiconductor and infrastructure software solutions.</p>
            </div>
        </div>
    )
}

function Pagination() {
    return (
        <div className="pagination p1">
            <style jsx>
                {`
                a{
                    text-decoration: none;
                }

                li, a{
                    font-size: 14px;
                    font-family: 'Inter';
                    font-weight: 500;
                }

                .pagination{
                    justify-content: center;
                    margin: 30px 0;
                }

                .pagination ul{
                    margin: 0;
                    padding: 0;
                    list-style-type: none;
                }

                .pagination a{
                    display: inline-block;
                    padding: 10px 18px;
                    color: #000;
                }

                .p1 a{
                    width: 36px;
                    height: 36px;
                    line-height: 36px;
                    padding: 0;
                    text-align: center;
                }

                .p1 a.is-active{
                    background-color: #1E202D;
                    border-radius: 100%;
                    color: #fff;
                }
            `}
            </style>
            <ul>
                <a className="is-active" href="#"><li>1</li></a>
                <a href="#"><li>2</li></a>
                <a href="#"><li>3</li></a>
                <a href="#"><li>4</li></a>
                <a href="#"><li>5</li></a>
                <a href="#"><li>...</li></a>
                <a href="#"><li>10</li></a>
            </ul>
        </div>
    )
}