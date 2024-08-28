import { useEffect, useState, Fragment, Component } from 'react';
import { Button, FloatingLabel, Form, Modal, Tab, Tabs, Table } from 'react-bootstrap';

import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';

import PuffLoader from "react-spinners/PuffLoader";
import { Icon } from 'react-icons-kit';
import { plus } from 'react-icons-kit/entypo/plus';
import { Bar, Doughnut } from 'react-chartjs-2';

import getAllJobs from '../../services/backlog/getAllJobs';
import getNextMonthJobs from '../../services/backlog/getNextMonthJobs';
import getFutureJobs from '../../services/backlog/getFutureJobs';
import getAllSubJobs from '../../services/backlog/getAllSubJobs';
import getSingleJob from '../../services/backlog/getSingleJob';
import updateJob from '../../services/backlog/updateJob';
import updateEmail from '../../services/backlog/updateEmail';
import updateHold from '../../services/backlog/updateHold';
import { Sidebar } from '../sidebar/Sidebar';
import './backlog.css';

export const Backlog = () => {
    const cookies = new Cookies();
    let cookieData;
    try {
        cookieData = jwt_decode(cookies.get('jwt'));
    } catch {
        cookieData = {
            'name': '',
            'role': 'employee',
        };
    }

    const [searchedValueOrderNo, setSearchedValueOrderNo] = useState('');
    const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
    const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
    const [searchedValueArea, setSearchedValueArea] = useState('');
    const [searchedValueOSV, setSearchedValueOSV] = useState('');

    const [jobNo, setJobNo] = useState('');
    const [jobType, setJobType] = useState('');
    const [partNo, setPartNo] = useState('');
    const [partRev, setPartRev] = useState('');
    const [custCode, setCustCode] = useState('');
    const [routing, setRouting] = useState([]);
    const [id, setId] = useState('');
    const [blNotes, setBlNotes] = useState('');
    const [osvNotes, setOsvNotes] = useState('');
    const [cdate, setCdate] = useState('');
    const [email, setEmail] = useState(0);
    const [hold, setHold] = useState(0);
    const [update, setUpdate] = useState('');

    const [jobs, setJobs] = useState([]);
    const [nextMonthJobs, setNextMonthJobs] = useState([]);
    const [allFutureJobs, setAllFutueJobs] = useState([]);
    const [subJobs, setSubJobs] = useState([]);
    const [futureJobs, setFutureJobs] = useState([]);
    const [pastJobs, setPastJobs] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [showRoute, setShowRoute] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(true);

    const [current, setCurrent] = useState('C');
    const [nextMonth, setNextMonth] = useState('N');
    const [futureMonths, setFutureMonths] = useState('F');
    const [overview, setOverview] = useState('Overview');
    
    const [lateJobs, setLateJobs] = useState(0);
    const [upcomingJobs, setUpcomingJobs] = useState(0);
    const [monthJobs, setMonthJobs] = useState(0);
    const [totalJobs, setTotalJobs] = useState(0);
    
    const [lateEng, setLateEng] = useState(0);
    const [lateShear, setLateShear] = useState(0);
    const [latePunch, setLatePunch] = useState(0);
    const [lateLaser, setLateLaser] = useState(0);
    const [lateBrake, setLateBrake] = useState(0);
    const [lateHard, setLateHard] = useState(0);
    const [lateTLaser, setLateTLaser] = useState(0);
    const [lateSaw, setLateSaw] = useState(0);
    const [lateWeld, setLateWeld] = useState(0);
    const [lateAssy, setLateAssy] = useState(0);
    const [latePowder, setLatePowder] = useState(0);
    const [lateOSV, setLateOSV] = useState(0);
    const [lateSum, setLateSum] = useState(0);
    const [futureEng, setFutureEng] = useState(0);
    const [futureShear, setFutureShear] = useState(0);
    const [futurePunch, setFuturePunch] = useState(0);
    const [futureLaser, setFutureLaser] = useState(0);
    const [futureBrake, setFutureBrake] = useState(0);
    const [futureHard, setFutureHard] = useState(0);
    const [futureTLaser, setFutureTLaser] = useState(0);
    const [futureSaw, setFutureSaw] = useState(0);
    const [futureWeld, setFutureWeld] = useState(0);
    const [futureAssy, setFutureAssy] = useState(0);
    const [futurePowder, setFuturePowder] = useState(0);
    const [futureOSV, setFutureOSV] = useState(0);
    const [futureSum, setFutureSum] = useState(0);

    const [thisWeekSum, setThisWeekSum] = useState(0);
    const [secondWeekSum, setSecondWeekSum] = useState(0);
    const [thirdWeekSum, setThirdWeekSum] = useState(0);

    const formatDate = (dateStr) => {
        if (!dateStr) return new Date(0);
        const [year, month, day] = dateStr.split('-');
        return new Date(year, month - 1, day.split('T')[0]);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allJobs, nextJobs, moreJobs] = await Promise.all([
                getAllJobs(),
                getNextMonthJobs(),
                getFutureJobs(),
            ]);
            console.log(allJobs)
            let masters = allJobs.filter(row => row.MasterJobNo != null);
            let masterJobs = []
            masters.forEach((e) => {
                masterJobs.push(e.MasterJobNo)
            })
            let nonEmptyJobs = masterJobs.filter(row => row != '')
            
            allJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })

            console.log(allJobs)
            
            nextJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })
            setNextMonthJobs(nextJobs);
            
            moreJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })
            setAllFutueJobs(moreJobs);
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const sortedJobs = allJobs.sort((a, b) => formatDate(a.DueDate) - formatDate(b.DueDate));
            const pastJobs = sortedJobs.filter(job => formatDate(job.DueDate) < yesterday);
            const futureJobs = sortedJobs.filter(job => formatDate(job.DueDate) >= yesterday);
            const pastJobsNo = pastJobs.filter(job => !job.MasterJobNo);
            const sortedJobsNo = sortedJobs.filter(job => !job.MasterJobNo);

            const thisMonthNo = today.getMonth();
            const nextMonthNo = today.getMonth() + 1;
            const futureMonthNo = today.getMonth() + 2;
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];

            const dayOfWeek = today.getDay();
            const sunday = new Date(today);
            const saturday = new Date(today);
            sunday.setDate(today.getDate() - dayOfWeek);
            saturday.setDate(today.getDate() - dayOfWeek +6);
            const secondSunday = new Date(today);
            const secondSaturday = new Date(today);
            secondSunday.setDate(today.getDate() - dayOfWeek +7);
            secondSaturday.setDate(today.getDate() - dayOfWeek +13);
            const thirdSunday = new Date(today);
            const thirdSaturday = new Date(today);
            thirdSunday.setDate(today.getDate() - dayOfWeek +14);
            thirdSaturday.setDate(today.getDate() - dayOfWeek +20);

            let thisWeekProjected = 0;
            let secondWeekProjected = 0;
            let thirdWeekProjected = 0;

            allJobs.forEach(job => {
                const jobDate = new Date(job.dataValues.cdate);
                const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
            
                if (jobDate >= sunday && jobDate <= saturday) {
                    thisWeekProjected += value;
                } else if (jobDate >= secondSunday && jobDate <= secondSaturday) {
                    secondWeekProjected += value;
                } else if (jobDate >= thirdSunday && jobDate <= thirdSaturday) {
                    thirdWeekProjected += value;
                }
            });

            setThisWeekSum(thisWeekProjected);
            setSecondWeekSum(secondWeekProjected);
            setThirdWeekSum(thirdWeekProjected);

            setLateJobs(pastJobsNo.length);
            setUpcomingJobs(sortedJobsNo.length - pastJobsNo.length);
            setMonthJobs(sortedJobsNo.length);

            setLateEng((pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN' && row.User_Text2!='4. DONE')).length)
            setLateShear((pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
            setLatePunch((pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
            setLateLaser((pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
            setLateBrake((pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
            setLateHard((pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
            setLateTLaser((pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
            setLateSaw((pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
            setLateWeld((pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
            setLateAssy((pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
            setLatePowder((pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
            setLateOSV(((pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length));

            const totalLateSum = pastJobsNo.reduce((sum, job) => {
                const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
                return sum + value;
            }, 0);
            setLateSum(totalLateSum);
            
            setFutureEng((sortedJobsNo.filter(row => row.WorkCntr == '101 ENGIN' && row.User_Text2!='4. DONE')).length - (pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN' && row.User_Text2!='4. DONE')).length)
            setFutureShear((sortedJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length - (pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
            setFuturePunch((sortedJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length - (pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
            setFutureLaser((sortedJobsNo.filter(row => row.WorkCntr == '203 LASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
            setFutureBrake((sortedJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length - (pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
            setFutureHard((sortedJobsNo.filter(row => row.WorkCntr == '206 HARD')).length - (pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
            setFutureTLaser((sortedJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
            setFutureSaw((sortedJobsNo.filter(row => row.WorkCntr == '301 SAW')).length - (pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
            setFutureWeld((sortedJobsNo.filter(row => row.WorkCntr == '402 WELD')).length - (pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
            setFutureAssy((sortedJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length - (pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
            setFuturePowder((sortedJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length - (pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
            setFutureOSV((sortedJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length - (pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length);

            const totalFutureSum = sortedJobsNo.reduce((sum, job) => {
                const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
                return sum + value;
            }, 0);
            setFutureSum(totalFutureSum - totalLateSum);

            setCurrent(months[thisMonthNo]);
            setNextMonth(months[nextMonthNo]);
            setFutureMonths(`${months[futureMonthNo]} +`);
            setOverview(`Overview (${months[thisMonthNo]})`);
            setPastJobs(pastJobs);
            setFutureJobs(futureJobs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const updateData = async () => {
        try {
            const [allJobs, nextJobs, moreJobs] = await Promise.all([
                getAllJobs(),
                getNextMonthJobs(),
                getFutureJobs(),
            ]);
            let masters = allJobs.filter(row => row.MasterJobNo != null);
            let masterJobs = []
            masters.forEach((e) => {
                masterJobs.push(e.MasterJobNo)
            })
            let nonEmptyJobs = masterJobs.filter(row => row != '')
            
            allJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })

            nextJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })
            setNextMonthJobs(nextJobs);
            
            moreJobs.forEach((e) => {
                if (nonEmptyJobs.includes(e.JobNo)) {
                    e.HasSubs = 1
                } else {
                    e.HasSubs = 0
                }
            })
            setAllFutueJobs(moreJobs);
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const sortedJobs = allJobs.sort((a, b) => formatDate(a.DueDate) - formatDate(b.DueDate));
            const pastJobs = sortedJobs.filter(job => formatDate(job.DueDate) < yesterday);
            const futureJobs = sortedJobs.filter(job => formatDate(job.DueDate) >= yesterday);
            const pastJobsNo = pastJobs.filter(job => !job.MasterJobNo);
            const sortedJobsNo = sortedJobs.filter(job => !job.MasterJobNo);

            const thisMonthNo = today.getMonth();
            const nextMonthNo = today.getMonth() + 1;
            const futureMonthNo = today.getMonth() + 2;
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];

            const dayOfWeek = today.getDay();
            const sunday = new Date(today);
            const saturday = new Date(today);
            sunday.setDate(today.getDate() - dayOfWeek);
            saturday.setDate(today.getDate() - dayOfWeek +6);
            const secondSunday = new Date(today);
            const secondSaturday = new Date(today);
            secondSunday.setDate(today.getDate() - dayOfWeek +7);
            secondSaturday.setDate(today.getDate() - dayOfWeek +13);
            const thirdSunday = new Date(today);
            const thirdSaturday = new Date(today);
            thirdSunday.setDate(today.getDate() - dayOfWeek +14);
            thirdSaturday.setDate(today.getDate() - dayOfWeek +20);

            let thisWeekProjected = 0;
            let secondWeekProjected = 0;
            let thirdWeekProjected = 0;

            allJobs.forEach(job => {
                const jobDate = new Date(job.dataValues.cdate);
                const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
            
                if (jobDate >= sunday && jobDate <= saturday) {
                    thisWeekProjected += value;
                } else if (jobDate >= secondSunday && jobDate <= secondSaturday) {
                    secondWeekProjected += value;
                } else if (jobDate >= thirdSunday && jobDate <= thirdSaturday) {
                    thirdWeekProjected += value;
                }
            });

            setThisWeekSum(thisWeekProjected);
            setSecondWeekSum(secondWeekProjected);
            setThirdWeekSum(thirdWeekProjected);

            setLateJobs(pastJobsNo.length);
            setUpcomingJobs(sortedJobsNo.length - pastJobsNo.length);
            setMonthJobs(sortedJobsNo.length);

            setLateEng((pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN')).length)
            setLateShear((pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
            setLatePunch((pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
            setLateLaser((pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
            setLateBrake((pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
            setLateHard((pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
            setLateTLaser((pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
            setLateSaw((pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
            setLateWeld((pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
            setLateAssy((pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
            setLatePowder((pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
            setLateOSV(((pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length));

            const totalLateSum = pastJobsNo.reduce((sum, job) => {
                const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
                return sum + value;
            }, 0);
            setLateSum(totalLateSum);
            
            setFutureEng((sortedJobsNo.filter(row => row.WorkCntr == '101 ENGIN')).length - (pastJobsNo.filter(row => row.WorkCntr == '101 ENGIN')).length)
            setFutureShear((sortedJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length - (pastJobsNo.filter(row => row.WorkCntr == '201 SHEAR')).length)
            setFuturePunch((sortedJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length - (pastJobsNo.filter(row => row.WorkCntr == '202 PUNCH')).length)
            setFutureLaser((sortedJobsNo.filter(row => row.WorkCntr == '203 LASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '203 LASER')).length)
            setFutureBrake((sortedJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length - (pastJobsNo.filter(row => row.WorkCntr == '204 BRAKE')).length)
            setFutureHard((sortedJobsNo.filter(row => row.WorkCntr == '206 HARD')).length - (pastJobsNo.filter(row => row.WorkCntr == '206 HARD')).length)
            setFutureTLaser((sortedJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length - (pastJobsNo.filter(row => row.WorkCntr == '211 TLASER')).length)
            setFutureSaw((sortedJobsNo.filter(row => row.WorkCntr == '301 SAW')).length - (pastJobsNo.filter(row => row.WorkCntr == '301 SAW')).length)
            setFutureWeld((sortedJobsNo.filter(row => row.WorkCntr == '402 WELD')).length - (pastJobsNo.filter(row => row.WorkCntr == '402 WELD')).length)
            setFutureAssy((sortedJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length - (pastJobsNo.filter(row => row.WorkCntr == '702 ASSEM')).length)
            setFuturePowder((sortedJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length - (pastJobsNo.filter(row => row.WorkCntr == '601 POWDER')).length)
            setFutureOSV((sortedJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length - (pastJobsNo.filter(row => row.User_Text2 == '6. OUTSOURCE')).length);

            const totalFutureSum = sortedJobsNo.reduce((sum, job) => {
                const value = (job.QtyOrdered - job.QtyShipped2Cust) * job.UnitPrice;
                return sum + value;
            }, 0);
            setFutureSum(totalFutureSum - totalLateSum);

            setCurrent(months[thisMonthNo]);
            setNextMonth(months[nextMonthNo]);
            setFutureMonths(`${months[futureMonthNo]} +`);
            setOverview(`Overview (${months[thisMonthNo]})`);
            setPastJobs(pastJobs);
            setFutureJobs(futureJobs);
        } catch (err) {
            console.error(err);
        }
    };

    async function toggleEmail(id) {
        updateEmail(id);
        setUpdate('Email');
    }

    async function toggleHold(id) {
        updateHold(id);
        setUpdate('Hold');
    }

    const toggleSub = async (JobNo) => {
        if (expandedRows.includes(JobNo)) {
            setExpandedRows(expandedRows.filter(row => row !== JobNo));
        } else {
            try {
                const subs = await getAllSubJobs(JobNo);
                setSubJobs({
                    ...subJobs,
                    [JobNo]: subs
                });
                setExpandedRows([...expandedRows, JobNo]);
            } catch (err) {
                console.log(err);
            }
        }
    };

    const toggleRoute = async (job) => {
        try {
            const routing = await getSingleJob(job.JobNo);
            handleOpenRoute(job, routing);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCloseRoute = () => setShowRoute(false);
    const handleOpenRoute = (job, routing) => {
        setJobNo(job.JobNo);
        setJobType(job.User_Text3);
        setPartNo(job.PartNo);
        setPartRev(job.Revision);
        setCustCode(job.CustCode);
        setRouting(routing);
        setShowRoute(true);
    };

    const handleOpenJob = (job) => {
        setId(job.dataValues.id);
        setBlNotes(job.dataValues.blnotes);
        setOsvNotes(job.dataValues.osvnotes);
        setCdate(job.dataValues.cdate);
        setEmail(job.dataValues.email);
        setHold(job.dataValues.hold);
        setShowEdit(true)
    };
    
    const handleCancel = () => {
        setId('');
        setBlNotes('');
        setOsvNotes('');
        setCdate('');
        setEmail(0);
        setHold(0);
        setShowEdit(false);
    };

    const handleUpdate = async () => {
        try {
            await updateJob(id, blNotes, osvNotes, cdate);
            setId(0);
            setBlNotes('');
            setOsvNotes('');
            setCdate('');
            setShowEdit(false);
        } catch (err) {
            console.error(err);
        } finally {
            updateData();
        }
    };

    useEffect(() => {
        fetchData();
        setUpdate('');
    }, [update]);

    const donutDataJobs = {
        labels: ['Late', 'Future'],
        datasets: [
            {
                label: 'Jobs',
                data: [
                    (lateJobs),
                    (upcomingJobs)
                ],
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
        onClick: function(event, element) {
            console.log(element)
        },
    };
    
    const labels = ['Eng', 'Shear', 'Punch', 'Laser', 'Brake', 'Hard', 'TLaser', 'Saw', 'Weld', 'Assy', 'Powder', 'OSV'];
    
    const data = {
        labels,
        datasets: [
            {
                label: 'Late',
                data: [lateEng, lateShear, latePunch, lateLaser, lateBrake, lateHard, lateTLaser, lateSaw, lateWeld, lateAssy, latePowder, lateOSV],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Future',
                data: [futureEng, futureShear, futurePunch, futureLaser, futureBrake, futureHard, futureTLaser, futureSaw, futureWeld, futureAssy, futurePowder, futureOSV],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            {loading ?
                <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                    <h1 className='text-center m-3'>Backlog</h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
                        <PuffLoader color="red" />
                    </div>
                </div>
            :
                (cookieData.backlog ?
                    <div style={{ display: 'block', width: '100%', marginLeft: '80px' }}>
                        <h1 className='text-center m-3'>Backlog</h1>

                        <Modal show={showRoute} onHide={handleCloseRoute}>
                            <Modal.Header>
                                <Modal.Title  className="modal-title-custom">
                                    <div>JOB {jobNo}</div>
                                    <div>{jobType}</div>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <div>Part Number: {partNo}</div>
                                <div>Revision: {partRev}</div>
                                <div>Customer: {custCode}</div>
                            </Modal.Body>
                            <Modal.Footer className="modal-footer-custom justify-content-center">
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th className='text-center'>Step</th>
                                            <th className='text-center'>Operation</th>
                                            <th className='text-center'>Status</th>
                                            <th className='text-center'>Employee</th>
                                            <th className='text-center'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {routing.map((step, index) => {
                                            return (
                                                <tr step={step} key={index}>
                                                    <td className='text-center'>{step.StepNo}</td>
                                                    {step.WorkCntr ?
                                                        <td className='text-center'>{step.WorkCntr}</td>
                                                    :
                                                        <td className='text-center'>{step.VendCode}</td>
                                                    }
                                                    <td className='text-center'>{step.Status}</td>
                                                    <td className='text-center'>{step.EmplCode}</td>
                                                    {step.ActualEndDate ? 
                                                        <td className='text-center'>{(step.ActualEndDate).split('-')[1] + '/' + ((step.ActualEndDate).split('-')[2]).split('T')[0] + '/' + ((step.ActualEndDate).split('-')[0]).slice(-2)}</td>
                                                    :
                                                        <td className='text-center'></td>
                                                    }
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showEdit}>
                            <Modal.Header>
                                <Modal.Title>Backlog Status</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FloatingLabel label="Backlog Notes" className="mb-3">
                                    <Form.Control 
                                        style={{ height: '125px' }}
                                        as="textarea"
                                        defaultValue={blNotes} 
                                        onChange={(e) => setBlNotes(e.target.value)} 
                                        className="large-input" 
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="floatingInput" label="OSV Status" className="mb-3">
                                    <Form.Control defaultValue={osvNotes} onChange={(e) => setOsvNotes(e.target.value)} />
                                </FloatingLabel>
                                <FloatingLabel label="Commitment Date" className="mb-3">
                                    <Form.Control type="date" defaultValue={cdate} onChange={(e) => setCdate(e.target.value)} />
                                </FloatingLabel>
                                <Form.Group className="d-flex flex-wrap justify-content-center m-3 gap-5">
                                    <div className="d-flex align-items-center mx-2">
                                        <Form.Label style={{ fontWeight: 'normal', fontSize: '16px' }} className="me-2 mb-0">Email/Expedite</Form.Label>
                                        <Form.Check 
                                            type="checkbox" 
                                            onChange={(e) => {setEmail(e.target.checked); toggleEmail(id)}}
                                            checked={email}
                                        />
                                    </div>
                                    <div className="d-flex align-items-center mx-2">
                                        <Form.Label style={{ fontWeight: 'normal', fontSize: '16px' }} className="me-2 mb-0">Hold</Form.Label>
                                        <Form.Check 
                                            type="checkbox" 
                                            onChange={(e) => {setHold(e.target.checked); toggleHold(id)}}
                                            checked={hold}
                                        />
                                    </div>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer className="justify-content-center">
                                <Button className='modalBtnCancel' variant="secondary" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button className='modalBtnVerify' variant="primary" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Tabs
                            defaultActiveKey="current"
                            id="justify-tab-example"
                            className='mb-3'
                            justify
                        >
                            <Tab eventKey="current" title={current}>

                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center' width='2%'></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueOrderNo(e.target.value)} placeholder='&#xf002;  Order No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Due Date</th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Quantity</th>
                                                <th className='text-center' width='7%'>Unit Price</th>
                                                <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Current Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueOSV(e.target.value)} placeholder='&#xf002;  OSV' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='12%'>OSV Status</th>
                                                <th className='text-center' width='9%'>Commitment Date</th>
                                                <th className='text-center' width='20%'>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pastJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                .filter((row) => {
                                                    const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                                                    return !searchedValueArea || 
                                                        searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                                                })
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    const shipClass = (job.User_Text2=='4. DONE') ? 'ship-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.QtyOrdered - job.QtyShipped2Cust}</td>
                                                                    <td className='text-center'>{job.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    {job.dataValues.cdate ? 
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</td>
                                                                    :
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
                                                                        <td className='text-center'>{subJob.OrderNo}</td>
                                                                        <td className='text-center'>{subJob.JobNo}</td>
                                                                        <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                        <td className='text-center'>{subJob.CustCode}</td>
                                                                        <td className='text-center'>{subJob.QtyOrdered - subJob.QtyShipped2Cust}</td>
                                                                        <td className='text-center'>{subJob.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                        {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</td>
                                                                        }
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        {subJob.dataValues.cdate ? 
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</td>
                                                                        :
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
                                                                    </tr>
                                                                ))}
                                                            </Fragment>
                                                        )
                                                    }
                                                })
                                            }
                                            <tr className='empty-row late-row'><td colSpan="12">-</td></tr>
                                            {futureJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                .filter((row) => {
                                                    const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                                                    return !searchedValueArea || 
                                                        searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                                                })
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    const shipClass = (job.User_Text2=='4. DONE') ? 'ship-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.QtyOrdered - job.QtyShipped2Cust}</td>
                                                                    <td className='text-center'>{job.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                    :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    {job.dataValues.cdate ? 
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</td>
                                                                    :
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
                                                                        <td className='text-center'>{subJob.OrderNo}</td>
                                                                        <td className='text-center'>{subJob.JobNo}</td>
                                                                        <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                        <td className='text-center'>{subJob.CustCode}</td>
                                                                        <td className='text-center'>{subJob.QtyOrdered - subJob.QtyShipped2Cust}</td>
                                                                        <td className='text-center'>{subJob.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                        {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</td>
                                                                        }
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        {subJob.dataValues.cdate ? 
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</td>
                                                                        :
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
                                                                    </tr>
                                                                ))}
                                                            </Fragment>
                                                        )
                                                    }
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab>

                            <Tab eventKey="nextMonth" title={nextMonth}>
                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center' width='2%'></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueOrderNo(e.target.value)} placeholder='&#xf002;  Order No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Due Date</th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Quantity</th>
                                                <th className='text-center' width='7%'>Unit Price</th>
                                                <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Current Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueOSV(e.target.value)} placeholder='&#xf002;  OSV' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='12%'>OSV Status</th>
                                                <th className='text-center' width='9%'>Commitment Date</th>
                                                <th className='text-center' width='20%'>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {nextMonthJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                .filter((row) => {
                                                    const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                                                    return !searchedValueArea || 
                                                        searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                                                })
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    const shipClass = (job.User_Text2=='4. DONE') ? 'ship-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.QtyOrdered - job.QtyShipped2Cust}</td>
                                                                    <td className='text-center'>{job.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    {job.dataValues.cdate ? 
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</td>
                                                                    :
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
                                                                        <td className='text-center'>{subJob.OrderNo}</td>
                                                                        <td className='text-center'>{subJob.JobNo}</td>
                                                                        <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                        <td className='text-center'>{subJob.CustCode}</td>
                                                                        <td className='text-center'>{subJob.QtyOrdered - job.QtyShipped2Cust}</td>
                                                                        <td className='text-center'>{subJob.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                        {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</td>
                                                                        }
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        {subJob.dataValues.cdate ? 
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</td>
                                                                        :
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
                                                                    </tr>
                                                                ))}
                                                            </Fragment>
                                                        )
                                                    }
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab>

                            <Tab eventKey="futureMonths" title={futureMonths}>
                                <div className='mx-3'>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th className='text-center' width='2%'></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueOrderNo(e.target.value)} placeholder='&#xf002;  Order No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueJobNo(e.target.value)} placeholder='&#xf002;  Job No' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Due Date</th>
                                                <th className='text-center' width='7%'><input onChange={(e) => setSearchedValueCustomer(e.target.value)} placeholder='&#xf002;  Customer' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='7%'>Quantity</th>
                                                <th className='text-center' width='7%'>Unit Price</th>
                                                <th className='text-center' width='10%'><input onChange={(e) => setSearchedValueArea(e.target.value)} placeholder='&#xf002;  Current Area' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='5%'><input onChange={(e) => setSearchedValueOSV(e.target.value)} placeholder='&#xf002;  OSV' className='text-center searchBox' style={{width: '100%', fontFamily: 'Segoe UI, FontAwesome'}} /></th>
                                                <th className='text-center' width='12%'>OSV Status</th>
                                                <th className='text-center' width='9%'>Commitment Date</th>
                                                <th className='text-center' width='20%'>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allFutureJobs
                                                .filter((row) => 
                                                    !searchedValueOrderNo || row.OrderNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueOrderNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueJobNo || row.JobNo
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueJobNo.toString().toLowerCase())
                                                )
                                                .filter((row) => 
                                                    !searchedValueCustomer || row.CustCode
                                                        .toString()
                                                        .toLowerCase()
                                                        .includes(searchedValueCustomer.toString().toLowerCase())
                                                )
                                                .filter((row) => {
                                                    const searchTarget = row.WorkCntr && row.User_Text2 !== '4. DONE' ? row.WorkCntr : row.User_Text2;
                                                    return !searchedValueArea || 
                                                        searchTarget.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase());
                                                })
                                                .filter((row) => {
                                                    if (!searchedValueOSV) { return true; }
                                                    if (!row || !row.VendCode) { return false; }
                                                    
                                                    return row.VendCode
                                                        .toString()
                                                        .toLowerCase()                                           
                                                        .includes(searchedValueOSV.toString().toLowerCase())
                                                })
                                                .map((job, index) => {
                                                    const profitClass = (job.OrderTotal > 5000) ? 'profit-row' : '';
                                                    const expediteClass = (job.dataValues.email) ? 'bl-expedite-row' : '';
                                                    const holdClass = (job.dataValues.hold) ? 'hold-row' : '';
                                                    const shipClass = (job.User_Text2=='4. DONE') ? 'ship-row' : '';
                                                    if (!job.MasterJobNo) {
                                                        return (
                                                            <Fragment key={index}>
                                                                <tr job={job} className={`${expediteClass} ${holdClass} ${profitClass} ${shipClass}`}>
                                                                    {job.HasSubs ?
                                                                        <td className='text-center' onClick={() => toggleSub(job.JobNo)}>
                                                                            <Icon icon={plus}/>
                                                                        </td>
                                                                        :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.OrderNo}</td>
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.JobNo}</td>
                                                                    <td className='text-center'>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                    <td className='text-center'>{job.CustCode}</td>
                                                                    <td className='text-center'>{job.QtyOrdered - job.QtyShipped2Cust}</td>
                                                                    <td className='text-center'>{job.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                    {job.WorkCntr && job.User_Text2 !== '4. DONE' ?
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                        <td className='text-center' onClick={() => toggleRoute(job)}>{(job.User_Text2).split(' ')[1]}</td>
                                                                    }
                                                                    {job.User_Text2 == '6. OUTSOURCE' ?
                                                                        <td className='text-center'>{job.VendCode}</td>
                                                                    :
                                                                        <td className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.osvnotes}</td>
                                                                    {job.dataValues.cdate ? 
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'>{(job.dataValues.cdate).split('-')[1] + '/' + (job.dataValues.cdate).split('-')[2] + '/' + (job.dataValues.cdate).split('-')[0]}</td>
                                                                    :
                                                                        <td onClick={() => handleOpenJob(job)} className='text-center'></td>
                                                                    }
                                                                    <td onClick={() => handleOpenJob(job)} className='text-center'>{job.dataValues.blnotes}</td>
                                                                </tr>
                                                                {expandedRows.includes(job.JobNo) && subJobs[job.JobNo] && subJobs[job.JobNo].map((subJob, subIndex) => (
                                                                    <tr key={subIndex} className='subjob-row'>
                                                                        <td className='text-center'></td>
                                                                        <td className='text-center'>{subJob.OrderNo}</td>
                                                                        <td className='text-center'>{subJob.JobNo}</td>
                                                                        <td className='text-center'>{(subJob.DueDate).split('-')[1] + '/' + ((subJob.DueDate).split('-')[2]).split('T')[0]}</td>
                                                                        <td className='text-center'>{subJob.CustCode}</td>
                                                                        <td className='text-center'>{subJob.QtyOrdered - job.QtyShipped2Cust}</td>
                                                                        <td className='text-center'>{subJob.UnitPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                                                        {subJob.WorkCntr && subJob.User_Text2 !== '4. DONE' ?
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.WorkCntr).split(' ')[1]}</td>
                                                                        :
                                                                            <td className='text-center' onClick={() => toggleRoute(subJob)}>{(subJob.User_Text2).split(' ')[1]}</td>
                                                                        }
                                                                        {subJob.User_Text2 == '6. OUTSOURCE' ?
                                                                            <td className='text-center'>{subJob.VendCode}</td>
                                                                        :
                                                                            <td className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.osvnotes}</td>
                                                                        {subJob.dataValues.cdate ? 
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'>{(subJob.dataValues.cdate).split('-')[1] + '/' + (subJob.dataValues.cdate).split('-')[2] + '/' + (subJob.dataValues.cdate).split('-')[0]}</td>
                                                                        :
                                                                            <td onClick={() => handleOpenJob(subJob)} className='text-center'></td>
                                                                        }
                                                                        <td onClick={() => handleOpenJob(subJob)} className='text-center'>{subJob.dataValues.blnotes}</td>
                                                                    </tr>
                                                                ))}
                                                            </Fragment>
                                                        )
                                                    }
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab>

                            <Tab eventKey="overview" title={overview}>
                                <div className='mx-3'>
                                    <div className="row homeFlex">
                                        <div className="homeLeft">
                                            <div className="row homeBox">
                                                <div className="row jobTitle">  
                                                    <h2 className='text-center'>{current}</h2>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th className='text-end tableKey'>Total Jobs</th>
                                                                <th className='text-start tableValue'>{monthJobs}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Late Jobs</th>
                                                                <th className='text-start tableValue'>{lateJobs}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Future Jobs</th>
                                                                <th className='text-start tableValue'>{upcomingJobs}</th>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row homeBox">
                                                <div className="row jobTitle">  
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <th className='text-end tableKey'>Late Revenue</th>
                                                                <th className='text-start tableValue'>{lateSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Upcoming Revenue</th>
                                                                <th className='text-start tableValue'>{futureSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                                                            </tr>
                                                            <tr>
                                                                <th colSpan="2" className='text-center projectedRevenue'>Projected Revenue</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Current Week</th>
                                                                <th className='text-start tableValue'>{thisWeekSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Next Week</th>
                                                                <th className='text-start tableValue'>{secondWeekSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-end tableKey'>Third Week</th>
                                                                <th className='text-start tableValue'>{thirdWeekSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</th>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className="row homeBox homeBottom">
                                                <Doughnut data={donutDataJobs} />
                                            </div>
                                        </div>
                                        <div className="homeRight homeBox">
                                            <Bar 
                                                options={options} 
                                                data={data} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px', width: '100%' }}>
                        <h1>You don't have access to this page</h1>
                    </div>
                )
            }
        </div>
    )
}