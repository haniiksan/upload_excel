<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Upload_excel_model extends CI_Model{
	public function do_read(){
		$this->db->select('*');
		$this->db->from('identitas');
		return $this->db->get();
	}

	public function do_update($param){
		$this->db->where('id',$param['id']);
		$this->db->update('identitas',$param);
		return true;
	}

	public function do_insert($param){
		$this->db->insert('identitas',$param);
		return true;
	}
}
