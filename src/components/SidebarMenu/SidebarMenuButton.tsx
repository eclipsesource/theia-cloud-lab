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
        'w-full flex relative items-center px-6 h-12 overflow-hidden text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-slate-300 transition duration-300 ease-in-out cursor-pointer text-m text-gray-800'
      }
      onClick={() => router.push(props.href)}
    >
      {props.text}
    </button>
  );
};

export default SidebarMenuButton;
