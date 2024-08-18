import {Autocomplete} from '@material-ui/lab';
import {Popper} from "@material-ui/core";
import {useEffect, useState} from "react";

export function InputAutocomplete({
                                      Icon,
                                      options,
                                      onSelect,
                                      placeholder,
                                      _setOpenedAutoComplete,
                                      id,
                                      openedAutoComplete,
                                      // resetFiltersRand,
                                      initialValue, updateValue
                                  }) {
    const [shownOptions, setShownOptions] = useState([])
    // const [typedValue, setTypedValue] = useState("")
    const value = initialValue;


    const onSelectedValue = (value) => {
        updateValue(value)
        onSelect(value)
    }

    useEffect(() => {
        const array = options.filter(item => {
            return item && value && (value.trim() !== "") && item.toLowerCase().includes(value.toLowerCase())
        })
        setShownOptions(array)
    }, [value])
    // useEffect(() => {
    //     setTypedValue("")
    // }, [resetFiltersRand])
    // useEffect(() => {
    //     setTypedValue(initialValue)
    // }, [])

    const styles = (theme) => ({
        popper: {
            maxHeight: 200,
            overflow: 'hidden'
        }
    });
    const PopperMy = function (props) {
        return <Popper {...props} style={styles.popper}/>;
    };

    return (
        <>
            <Autocomplete
                open={(shownOptions.length >= 1 && (value && value.trim() !== "")) && openedAutoComplete && openedAutoComplete === id}
                fullWidth={true}
                PopperComponent={PopperMy}
                onOpen={e => _setOpenedAutoComplete(id)}
                onClose={e => _setOpenedAutoComplete("")}
                inputValue={value}
                // classes={["input-icon"]}
                // id="custom-input-autocomplete"
                clearOnBlur={false}
                options={shownOptions}
                onInputChange={(event, values) => {
                    if (values.trim() === "") onSelectedValue("")
                    else if (event && event.type === "change") onSelectedValue(values)
                    else onSelectedValue(values)

                }}
                renderInput={(params) => (
                    <div ref={params.InputProps.ref} className={"input-icon"}>
                        <input type="text" {...params.inputProps} placeholder={placeholder}
                            // onChange={(event) => {
                            //     console.log(event.target.value)
                            // }}
                        />
                        <span>
                            {/*<Icon></Icon>*/}
                            <Icon/>
                        </span>
                    </div>
                )}
            />

            <style jsx>{`
              input {
                display: block;
                width: 100%;
                height: calc(1.5em + 1.3rem + 2px);
                padding: 0.65rem 1rem;
                font-size: 1rem;
                font-weight: 400;
                line-height: 1.5;
                color: #3F4254;
                background-color: #ffffff;
                background-clip: padding-box;
                border: 1px solid #E4E6EF;
                border-radius: 0.42rem;
                -webkit-box-shadow: none;
                box-shadow: none;
                -webkit-transition: border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
                transition: border-color 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
                transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
                padding-left: calc(1.5em + 1.3rem + 2px) !important;
              }


              //.autocomplete {
              //  position: absolute;
              //  z-index: 10;
              //  display: -webkit-box;
              //  display: -webkit-flex;
              //  display: -ms-flexbox;
              //  display: flex;
              //  top: 100%;
              //  padding: 10px;
              //  -webkit-flex-direction: column;
              //  -ms-flex-direction: column;
              //  flex-direction: column;
              //  width: 93.5%;
              //  background-color: white;
              //  max-height: 210px;
              //  overflow-y: hidden;
              //  border: 1px solid #ddd;
              //  border-radius: 1.25rem;
              //  border-top-right-radius: 0;
              //  border-top-left-radius: 0;
              //}
              //
              //.autocomplete > p:hover {
              //  background-color: #e1f0ff;
              //  cursor: pointer;
              //}

            `}</style>
        </>
    )
}