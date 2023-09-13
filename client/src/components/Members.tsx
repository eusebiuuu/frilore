
type MembersProps = {
  members: {
    member_id: string,
    username: string,
    image_url: string,
  }[],
}

const SHOW_NUM = 2;

export default function Members(props: MembersProps) {
  const { members } = props;
  const end = Math.min(SHOW_NUM, members.length);
  const diff = Math.max(members.length - SHOW_NUM, 0);
  return (
    <div className='flex mt-2'>
      {
        members.length === 0
        ? <h3>No members</h3>
        : members.slice(0, end).map(elem => {
          return <img key={elem.member_id} src={elem.image_url} 
            className={`h-10 w-10 rounded-full ${members.length === 1 ? '' : '-ml-2'} 
            border-2 border-white bg-white`}
          />
        })
      }
      { diff > 0 && (
        <div className='rounded-full bg-gray-300 -ml-2 border-2 border-white p-1 grid place-items-center w-10'>
          <h5 className='tracking-tighter'>+{diff}</h5>
        </div>
      )}
    </div>
  )
}