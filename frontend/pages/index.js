import JobIndex from "./jobs";


export default function Home({props, user, serverUrl, router, pageTitle}) {
    return <JobIndex
        {...props} user={user} serverUrl={serverUrl} router={router} pageTitle={pageTitle}
    />
}