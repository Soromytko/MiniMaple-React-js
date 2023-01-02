function LaunchList(props){

    return(
        <aside className="aside" id="launchesContainer">
            <ul>
                {props.launches.map(launch=>{
                    return <li key={launch.id}>{launch.name}</li>
                })}
            </ul>
        </aside>
    )
}

export {LaunchList}