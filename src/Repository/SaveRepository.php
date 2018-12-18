<?php

namespace App\Repository;

use App\Entity\Save;
use App\Entity\Inventory;
use App\Entity\Item;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\Query\Expr\Join;

/**
 * @method Save|null find($id, $lockMode = null, $lockVersion = null)
 * @method Save|null findOneBy(array $criteria, array $orderBy = null)
 * @method Save[]    findAll()
 * @method Save[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SaveRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Save::class);
    }

    // /**
    //  * @return Save[] Returns an array of Save objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Save
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */

    
}
