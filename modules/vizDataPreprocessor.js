import { get as getStorage } from 'storage';

function prepareDataForProvenanceBarChart () {
  const candidatLicenceGenerale = getStorage( 'N_can_lg3' );
  const candidatLicencePro = getStorage( 'N_can_lp3' );
  const candidatMaster = getStorage( 'N_can_master' );
  const candidatAutre = getStorage( 'N_can_autr' );
  const candidatNonInscrit = getStorage( 'N_can_noninscri' );
  const candidatAccepte = getStorage( 'N_accept' );

  
}