import React, { useEffect, useRef } from 'react'
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid"
import './SearchBar.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import records from '../local-json/reservations.json'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Resultlist from './ResultList';
import { SearchBar } from 'idm-reservation-search-results-details-lib';


const Searchbar = () => {
    const [reservationData, setReservationData] = React.useState([]);
    const [searchResultList, setSearchResultList] = React.useState([]);
    const [searchFinished, setSearchFinished] = React.useState(false);
    const [noSearchResults, setNoSearchResults] = React.useState(false);
    const [searchParams, setSearchParams] = React.useState({name:"",email:"",phone:"",note:"",arrivel:null,departure:null,room:null});
    const effectRan = useRef(false);
    useEffect(()=>{
        if(effectRan.current === false){
            setReservationData(records);
            const htb = new SearchBar('search-bar-container',records);
            window.addEventListener("searchDone", (evt) => {
                const searchDoneCustomEvent = evt;
                displayResultListComponent(searchDoneCustomEvent.detail);
            });
            window.addEventListener("searchResultFlag", (evt) => {
                const searchResultFlagCustomEvent = evt;
                setNoSearchResults(searchResultFlagCustomEvent.detail);
            });
            window.addEventListener("clearSearchResult", (evt) => {
                const clearSearchResultCustomEvent = evt;
                setSearchResultList([]);
            })
        }

        return () => {
            effectRan.current = true;
        }
    },[])
    //object must set null
    const [arrivalValue, setArrivalValue] = React.useState(null);
    const [departureValue, setDepartureValue] = React.useState(null);
    const [roomSize, setRoomSize] = React.useState(null);
    
    const roomSizes = [
        {value: "business-suite", label: "Business Suite"},
        {value: "presidential-suite", label: "Presidential Suite"}
    ];

    const displayResultListComponent = (result) => {
        const displayResultList = new CustomEvent("displayResultList", {detail: result});
        window.dispatchEvent(displayResultList);
    }
    const handleRoomSelect = (event) => {
        setRoomSize(event.target.value);
    }
    const handleSearchParams = (event) => {
        const { name, value } = event.target;
        setSearchParams(searchParams => ({...searchParams, [name]: value}));
    }
    const clearSearchParams = () => {
        setSearchResultList([]);
        setSearchFinished(false);
        setSearchParams({name:"",email:"",phone:"",note:"",arrivel:null,departure:null,room:null});
        setArrivalValue(null);
        setDepartureValue(null);
        setRoomSize(null);
    }
    const searchReservation = () => {
        setSearchFinished(true);
        if(arrivalValue){
            searchParams.arrival = new Date(arrivalValue);
        }
        if(departureValue){
            searchParams.departure = new Date(departureValue);
        }
        if(roomSize){
            searchParams.room = roomSize;
        }

        setSearchResultList(reservationData.filter((r) => {
            return (searchParams.name ? (isStringInclude(r.firstName, searchParams.name) || isStringInclude(r.lastName, searchParams.name)) : true) &&
            (searchParams.email ? isStringInclude(r.email, searchParams.email) : true) &&
            (searchParams.phone ? isStringInclude(r.phone, searchParams.phone) : true) &&
            (searchParams.room ? isStringInclude(r.room.roomSize, searchParams.room) : true) &&
            (searchParams.note ? isStringInclude(r.note, searchParams.note) : true) &&
            (searchParams.arrival ? isDateEqual(r.stay.arrivalDate, searchParams.arrival) : true) &&
            (searchParams.departure ? isDateEqual(r.stay.departureDate, searchParams.departure) : true)
        }));
    }
    const isStringInclude = (originalString, searchString) =>{
        if(!originalString || !searchString) return false;
        if(originalString.toLowerCase().includes(searchString.toLowerCase())){
            return true;
        }
        return false;
    }
    const isDateEqual = (originalDate, searchDate) => {
        if(!originalDate || !searchDate) return false;
        if(new Date(originalDate).getTime() === searchDate.getTime()){
            return true;
        }
        return false;
    }
    return (
        <div>
            <div>
                <br />
                <h1 data-testid="search-bar-test-1">Reservation Search Page</h1>
                <br />
            </div>
            <br />
            <div className='search-container'>
                <div id="search-bar-container"></div>
            </div>
            <br />
            <Resultlist />
        </div>
    )
}
export default Searchbar