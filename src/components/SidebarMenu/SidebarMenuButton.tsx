import { useRouter } from 'next/router';

export type SidebarMenuButtonProps = {
  href: string;
  text: string;
};

const SidebarMenuButton = (props: SidebarMenuButtonProps) => {
  const router = useRouter();

  return (
    <button
      className={
        'text-m relative flex h-12 w-full cursor-pointer items-center overflow-hidden text-ellipsis whitespace-nowrap rounded px-6 text-gray-800 transition duration-300 ease-in-out hover:bg-slate-300 hover:text-gray-900'
      }
      onClick={() => router.push(props.href)}
    >
      {props.text}
    </button>
  );
};

export default SidebarMenuButton;
